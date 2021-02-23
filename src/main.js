import Vue from 'vue'
import App from './App.vue'
import { library } from '@fortawesome/fontawesome-svg-core'
import { faUserSecret } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { firestorePlugin } from 'vuefire'
import { BootstrapVue } from 'bootstrap-vue'
import "bootstrap";
import "bootstrap/dist/css/bootstrap.min.css"
import Notifications from 'vue-notification'
import VueRouter from 'vue-router'
import './scss/main.scss';
import 'firebase/auth'
import PulseLoader from 'vue-spinner/src/PulseLoader.vue'


Vue.use(Notifications)
Vue.use(VueRouter)
Vue.use(BootstrapVue)

Vue.use(firestorePlugin)
library.add(faUserSecret)

Vue.component('pulse-loader', require('vue-spinner/src/PulseLoader.vue'));

Vue.component('font-awesome-icon', FontAwesomeIcon)

import cabecera from './components/cabecera'
Vue.component(cabecera)

import productos from './components/productos'
Vue.component(productos)

import pie from './components/pie'
Vue.component(pie)

import novedad from './components/novedad'
Vue.component(novedad)

import carrito from './components/carrito'
Vue.component(carrito)

import home from './components/home'
Vue.component(home)

import registro from './components/registro'
Vue.component(registro)

import panel from './components/panel'
Vue.component(panel)

import Firebase from './db'
const routes = [
  { path: '/', component: home},
  { path: '/carrito', component: carrito, meta: {requiresAuth:true}},
  { path: '/registro', component: registro },
  { path: '/panel', component: panel }
]


const router = new VueRouter({
  routes // short for `routes: routes`
})

router.beforeEach((to, from, next) => {
  if (to.matched.some(ruta => ruta.meta.requiresAuth)){
    const user = Firebase.auth.currentUser;
    if (!user) {
      next('/');
    }else{
       next();
     }
    }else{
      next();
    }
 });
 
Vue.config.productionTip = false

new Vue({
  render: h => h(App),
  router,
  components: {
    PulseLoader
  }
}).$mount('#app')
