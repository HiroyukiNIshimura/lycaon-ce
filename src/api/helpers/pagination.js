module.exports = {
  friendlyName: 'Pagination',
  description: 'Pagination helper.',
  inputs: {
    page: {
      type: 'number',
      description: 'For thread paginate',
    },
    rowPerPage: {
      type: 'number',
      description: 'Rows per Page',
    },
  },
  exits: {
    success: {
      description: 'All done.',
    },
  },
  fn: async function (inputs) {
    var page = inputs.page;
    if (!page) {
      page = 1;
    }

    var rowPerPage = inputs.rowPerPage;
    if (!rowPerPage) {
      rowPerPage = 10;
    }

    return { page: page, skip: rowPerPage * (page - 1), limit: rowPerPage };
  },
};
