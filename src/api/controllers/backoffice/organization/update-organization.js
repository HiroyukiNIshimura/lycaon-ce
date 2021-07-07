module.exports = {
  friendlyName: 'update organization',

  description: 'update organization.',
  inputs: {
    id: {
      type: 'number',
      required: true,
      description: 'organization.id',
    },
    plan: {
      type: 'string',
      isIn: ['free', 'prime', 'pine', 'bamboo', 'plum'],
      defaultsTo: 'free',
    },
    deleted: {
      type: 'boolean',
    },
    customerName: {
      type: 'string',
      custom: function (value) {
        return [...value].length <= 100;
      },
    },
    zipCode: {
      type: 'string',
      custom: function (value) {
        return [...value].length <= 8;
      },
    },
    prefecture: {
      type: 'string',
      isIn: [
        '',
        '北海道',
        '青森県',
        '岩手県',
        '宮城県',
        '秋田県',
        '山形県',
        '福島県',
        '茨城県',
        '栃木県',
        '群馬県',
        '埼玉県',
        '千葉県',
        '東京都',
        '神奈川県',
        '新潟県',
        '富山県',
        '石川県',
        '福井県',
        '山梨県',
        '長野県',
        '岐阜県',
        '静岡県',
        '愛知県',
        '三重県',
        '滋賀県',
        '京都府',
        '大阪府',
        '兵庫県',
        '奈良県',
        '和歌山県',
        '鳥取県',
        '島根県',
        '岡山県',
        '広島県',
        '山口県',
        '徳島県',
        '香川県',
        '愛媛県',
        '高知県',
        '福岡県',
        '佐賀県',
        '長崎県',
        '熊本県',
        '大分県',
        '宮崎県',
        '鹿児島県',
        '沖縄県',
      ],
      defaultsTo: '',
      description: '都道府県',
    },
    city: {
      type: 'string',
      custom: function (value) {
        return [...value].length <= 100;
      },
      description: '市区町村',
    },
    street: {
      type: 'string',
      custom: function (value) {
        return [...value].length <= 100;
      },
      description: '番地など',
    },
    building: {
      type: 'string',
      custom: function (value) {
        return [...value].length <= 100;
      },
      description: '建物など',
    },
    phoneNo: {
      type: 'string',
      custom: function (value) {
        return [...value].length <= 20;
      },
      description: '電話番号',
    },
  },
  exits: {
    success: {},
    notFound: {
      responseType: 'notfound',
      description: 'The user has accessed a organization that has not joined.',
    },
  },

  fn: async function (inputs) {
    var current = await Organization.findOne({ id: inputs.id });
    if (!current) {
      throw 'notFound';
    }

    try {
      var org = {
        plan: inputs.plan,
        deleted: inputs.deleted,
      };

      var bill = {
        customerName: inputs.customerName,
        zipCode: inputs.zipCode,
        prefecture: inputs.prefecture,
        city: inputs.city,
        street: inputs.street,
        building: inputs.building,
        phoneNo: inputs.phoneNo,
        organization: current.id,
      };

      if (current.plan !== org.plan) {
        bill.planChangeAt = null;
      }

      await sails.getDatastore().transaction(async (db) => {
        await Organization.updateOne({
          id: current.id,
        })
          .set(org)
          .usingConnection(db);

        var billing = await Billing.findOne({ organization: current.id });
        if (billing) {
          await Billing.updateOne({
            id: current.id,
          })
            .set(bill)
            .usingConnection(db);
        } else {
          await Billing.create(bill).usingConnection(db);
        }
      });
    } catch (err) {
      sails.log.error(err);
      throw err;
    }

    this.req.session.effectMessage = sails.__('The organization has been updated');

    return { id: current.id };
  },
};
