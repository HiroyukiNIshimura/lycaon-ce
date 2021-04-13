/**
 * これより先に読み込んだvueコンポーネントなどを
 * 初期化する場合はここで行う
 */

/*https://github.com/ankurk91/vue-toast-notification */
Vue.use(VueToast, {
  type: 'default',
  position: 'top',
  duration: 3000,
  dismissible: true,
});

Vue.use(window.vueinview);

/*https://www.npmjs.com/package/vuejs-paginate*/
Vue.component('paginate', VuejsPaginate);
/*https://lian-yue.github.io/vue-upload-component/#/en/documents*/
Vue.component('file-upload', VueUploadComponent);

/*https://github.com/neuronetio/gantt-elastic */
Vue.component('gantt-header', Header);
Vue.component('gantt-elastic', GanttElastic);

/*https://github.com/ankurk91/vue-loading-overlay*/
Vue.use(VueLoading);
Vue.component('loadingOverlay', VueLoading);

//https://github.com/anteriovieira/vue-mindmap/blob/master/README.md?ref=kabanoki.net
Vue.use(VueMindmap);

/*https://future-architect.github.io/cheetah-grid/documents/introduction/getting-started-with-vue.html#installation */
Vue.use(vueCheetahGrid);
