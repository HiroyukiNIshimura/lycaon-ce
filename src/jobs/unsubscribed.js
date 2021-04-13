module.exports = {
  stateChange: async function () {
    //退会処理
    var dt = new Date();
    var targetDt = new Date(dt.getFullYear(), dt.getMonth(), 1);

    var NATIVE_ACTIVITY_SQL = `
select o.* from "organization" as o
  left outer join "billing" on "billing"."organization" = o."id"
 where "billing"."unsubscribedAt" is not null
   and "billing"."unsubscribedAt" < $1
   and o."deleted" = false
  `;

    var result = await sails.sendNativeQuery(NATIVE_ACTIVITY_SQL, [targetDt.valueOf()]);
    if (result.rows.length < 1) {
      return 'skip';
    }

    for (let organization of result.rows) {
      await Organization.updateOne({ id: organization.id }).set({ deleted: true });
    }
  },
};
