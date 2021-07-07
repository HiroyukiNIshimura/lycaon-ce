module.exports = {
  friendlyName: 'View mindmap',

  description: 'Display "Mindmap" page.',

  inputs: {
    handleId: {
      type: 'string',
      required: true,
      maxLength: 10,
      regex: /^[a-zA-Z0-9]+$/,
      description: 'organization.handleId',
    },
    no: {
      type: 'number',
      required: true,
      description: 'thread.no',
    },
  },

  exits: {
    success: {
      viewTemplatePath: 'pages/dashboard/mindmap',
    },
    notFound: {
      responseType: 'notfound',
      description: 'The user has accessed a thread that has not joined.',
    },
  },

  fn: async function (inputs) {
    var thread = await Thread.findOne({
      no: inputs.no,
      handleId: inputs.handleId,
    })
      .populate('parent')
      .populate('milestone');

    if (!thread) {
      throw 'notFound';
    }

    var team = await sails.helpers.validateMembership.with({
      id: thread.team,
      user: this.req.me,
    });

    if (!team) {
      throw 'notFound';
    }

    const maxdeep = sails.config.custom.mindmap.rootDepth;

    var trimName = function (s) {
      var chars = Array.from(s);
      if (chars.length > 10) {
        return chars.slice(0, 10).join('') + '...';
      }
      return s;
    };

    var getAroundMe = async function (id) {
      //
      var data = {
        nodes: [],
        connections: [],
        parent: undefined,
        children: [],
      };

      var current = await Thread.findOne({ id: id }).populate('parent').populate('milestone');
      if (!current) {
        throw 'notFound';
      }

      data.nodes.push({
        index: current.id,
        text: current.id,
        title: trimName(current.subject),
        url: `/${inputs.handleId}/thread/${current.no}`,
        note: current.milestone
          ? `[${current.milestone.name}] #${current.no} ${current.subject}`
          : `#${current.no} ${current.subject}`,
      });

      if (current.parent) {
        if (current.parent.milestone) {
          current.parent.milestone = await Milestone.findOne({ id: current.parent.milestone });
        }

        data.parent = current.parent.id;
        data.nodes.push({
          index: current.parent.id,
          text: current.parent.id,
          title: trimName(current.parent.subject),
          url: `/${inputs.handleId}/thread/${current.parent.no}`,
          note: current.parent.milestone
            ? `[${current.parent.milestone.name}] #${current.parent.no} ${current.parent.subject}`
            : `#${current.parent.no} ${current.parent.subject}`,
        });
        data.connections.push({ source: current.parent.id, target: current.id });
      }

      var refs = await ThreadRef.find({ left: current.id }).populate('right');
      for (let ref of refs) {
        if (current.parent && ref.right.id === current.parent) {
          continue;
        }
        data.children.push(ref.right.id);

        if (ref.right.milestone) {
          ref.right.milestone = await Milestone.findOne({ id: ref.right.milestone });
        }

        data.nodes.push({
          index: ref.right.id,
          text: ref.right.id,
          title: trimName(ref.right.subject),
          url: `/${inputs.handleId}/thread/${ref.right.no}`,
          note: ref.right.milestone
            ? `[${ref.right.milestone.name}] #${ref.right.no} ${ref.right.subject}`
            : `#${ref.right.no} ${ref.right.subject}`,
        });
        data.connections.push({ source: current.id, target: ref.right.id });
      }

      return data;
    };

    var res = await getAroundMe(thread.id);
    var nodes = res.nodes;
    var connections = res.connections;

    var p = res.parent;
    var i = maxdeep;
    while (i > 0) {
      if (p) {
        let res2 = await getAroundMe(p);
        for (let node of res2.nodes) {
          if (_.findIndex(nodes, { index: node.index }) < 0) {
            nodes.push(node);
          }
        }

        for (let conn of res2.connections) {
          let exists = _.filter(connections, (o) => {
            if (o.source === conn.source && o.target === conn.target) {
              return true;
            }
            if (o.source === conn.target && o.target === conn.source) {
              return true;
            }
            return false;
          });

          if (exists.length < 1) {
            connections.push(conn);
          }
        }
        p = res2.parent;
      } else {
        break;
      }
      i--;
    }

    for (let child of res.children) {
      let res2 = await getAroundMe(child);

      for (let node of res2.nodes) {
        if (_.findIndex(nodes, { index: node.index }) < 0) {
          nodes.push(node);
        }
      }

      for (let conn of res2.connections) {
        let exists = _.filter(connections, (o) => {
          if (o.source === conn.source && o.target === conn.target) {
            return true;
          }
          if (o.source === conn.target && o.target === conn.source) {
            return true;
          }
          return false;
        });

        if (exists.length < 1) {
          connections.push(conn);
        }
      }
    }

    var simulation = false;
    if (nodes.length < 2) {
      nodes = [];
      connections = [];
      simulation = true;
      for (let i = 0; i < 100; i++) {
        nodes.push({
          index: i,
          text: '',
          title: '',
          url: '',
          note: '',
        });
      }
    }

    return {
      thread: thread,
      nodes: nodes,
      connections: connections,
      simulation: simulation,
    };
  },
};
