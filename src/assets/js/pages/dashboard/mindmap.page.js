parasails.registerPage('mindmap', {
  //  ╦╔╗╔╦╔╦╗╦╔═╗╦    ╔═╗╔╦╗╔═╗╔╦╗╔═╗
  //  ║║║║║ ║ ║╠═╣║    ╚═╗ ║ ╠═╣ ║ ║╣
  //  ╩╝╚╝╩ ╩ ╩╩ ╩╩═╝  ╚═╝ ╩ ╩ ╩ ╩ ╚═╝
  data: {
    nodes: [],
    connections: [],
    editable: false,
    simulation: false,
  },

  //  ╦  ╦╔═╗╔═╗╔═╗╦ ╦╔═╗╦  ╔═╗
  //  ║  ║╠╣ ║╣ ║  ╚╦╝║  ║  ║╣
  //  ╩═╝╩╚  ╚═╝╚═╝ ╩ ╚═╝╩═╝╚═╝
  beforeMount: function () {
    if (this.simulation) {
      this.editable = true;
    } else {
      var initialRadius = 180;
      var initialAngle = Math.PI * (3 - Math.sqrt(5));

      for (var i = 0, n = this.nodes.length, node; i < n; ++i) {
        node = this.nodes[i];
        var radius = initialRadius * Math.sqrt(i);
        var angle = i * initialAngle;
        node.fx = radius * Math.cos(angle);
        node.fy = radius * Math.sin(angle);
      }

      for (let conn of this.connections) {
        conn.curve = { x: 30, y: 30 };
      }
    }
  },
  mounted: async function () {
    $('#node-' + this.thread.id).addClass('current-node');
    $('a').tooltip({
      trigger: 'hover focus',
      container: 'div.container',
    });
    console.log(this.nodes);
  },

  //  ╦╔╗╔╔╦╗╔═╗╦═╗╔═╗╔═╗╔╦╗╦╔═╗╔╗╔╔═╗
  //  ║║║║ ║ ║╣ ╠╦╝╠═╣║   ║ ║║ ║║║║╚═╗
  //  ╩╝╚╝ ╩ ╚═╝╩╚═╩ ╩╚═╝ ╩ ╩╚═╝╝╚╝╚═╝
  methods: {
    offEditable: function () {
      this.editable = false;
      console.log(this.nodes);
      this.$nextTick(() => {
        this.$refs.mindmap.renderMap();
        $('#node-' + this.thread.id).addClass('current-node');
        $('a').tooltip({
          trigger: 'hover focus',
          container: 'div.container',
        });
      });
    },
    onEditable: function () {
      this.editable = true;
      console.log(this.nodes);
      this.$nextTick(() => {
        this.$refs.mindmap.renderMap();
        $('#node-' + this.thread.id).addClass('current-node');
        $('a').tooltip({
          trigger: 'hover focus',
          container: 'div.container',
        });
      });
    },
  },
  computed: {
    returnLink: function () {
      return `/${this.organization.handleId}/thread/${this.thread.no}`;
    },
  },
});
