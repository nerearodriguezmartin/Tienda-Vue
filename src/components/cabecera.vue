
<template>
  
    <header class="header" >
        <!--cdn link fontawesome -->
    <link rel="stylesheet" href="https://use.fontawesome.com/releases/v5.15.2/css/all.css" integrity="sha384-vSIIfh2YWi9wW0r9iZe7RJPrKwp6bG+s9QZMoITbCckVJqGCCRhc+ccxNcdpHuYu" crossorigin="anonymous">
  <link rel="preconnect" href="https://fonts.gstatic.com">

  <link href="https://fonts.googleapis.com/css2?family=Dancing+Script:wght@600&display=swap" rel="stylesheet">
    <div class="logo">
      <router-link to="/">
        <img v-if="logo[0]!=null" :src="logo[0].img" class="logo-img">
      </router-link>
          
      </div>
      
      <nav class="first-nav">
          <ul class="first-nav-list">
              
              <li class="first-nav-item">
                  <a class="first-nav-link btn" data-toggle="modal" data-target="#exampleModalCenter" v-if="!authenticated" >
                      <i class="fas fa-sign-in-alt"></i> LOGIN
                  </a>

                  <!-- Modal -->
                  <div class="modal fade" id="exampleModalCenter" tabindex="-1" role="dialog" aria-labelledby="exampleModalCenterTitle" aria-hidden="true">
                    <div class="modal-dialog modal-lg modal-dialog-centered" role="document">
                      <div class="modal-content">
                        <div class="modal-header">
                          <h5 class="modal-title" id="exampleModalLongTitle">Inicia sesión en Soaps Shop</h5>
                          <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                            <span aria-hidden="true">&times;</span>
                          </button>
                        </div>
                        <div class="modal-body d-flex  align-items-center flex-column">
                         <button @click="loginG"><i class="fab fa-google"></i> Iniciar sesión con Google </button>
                         <button @click="loginFb"><i class="fab fa-facebook-f"></i> Iniciar sesión con Facebook </button>
                         <button @click="loginT"><i class="fab fa-twitter"></i> Iniciar sesión con Twitter </button>
                         <button @click="loginGit"><i class="fab fa-github"></i> Iniciar sesión con GitHub </button>
                         <label for="usuario">Usuario:</label>
                         <input type="email" id="usuario" nombre="usuario" v-model="usuario">
                         <label for="contraseña">Contraseña:</label>
                         <input type="password" id="contraseña" nombre="contraseña" v-model="contraseña">
                         <button @click="loginEyC">Login</button>
                         <router-link to="/registro" class="first-nav-link">¿Aún no te has registrado?</router-link>
                        </div>
                        
                      </div>
                    </div>
                  </div>


                  
                  <a  class="first-nav-link" v-if="authenticated" @click="logout">
                       {{firstName}}, <i class="fas fa-sign-out-alt"></i> LOGOUT
                  </a>
                  
                  
              </li>

              <li class="first-nav-item" >
                <router-link to="/panel" class="first-nav-link" v-if="admin">

                      <i class="fas fa-columns"></i>
                      PANEL

                </router-link>

              <li class="first-nav-item" @click="aviso">
                <router-link to="/carrito" class="first-nav-link" >

                      <i class="fas fa-shopping-cart"  ></i>
                        ({{numProductos}}, {{precioTotal}}€)

                </router-link>
              </li>
          </ul>
      </nav>
      
      <div class="heading">
          <h1 class="heading-text">The Soap Shop</h1>
      </div>
    </header>
    
      
      
  

</template>

<script lang="js">
 import {db} from '../db'
 import Firebase from '../db'

  export default  {
    name: 'cabecera',
    props: [],
    mounted () {

      Firebase.auth.onAuthStateChanged( user => {
        if (user) {
          this.user.loggedIn = true;
          this.user.data = user;
          this.$bind("carro", db.collection('carrito').where("user", "==", Firebase.auth.currentUser.email))
        }
        else {
          this.user.loggedIn = false;
          this.user.data = {};
          this.$router.push('/');
          this.$bind("carro", db.collection('carrito').where("user", "==", ""))
        }
      });
      
      
      
    
      
    },
    data () {
      return {
        logo: null,
        user: {
          loggedIn: false,
          data: {}
        },
          carro: null,
          usuario: "",
          contraseña: ""
      }
    },
    methods: {
      loginG() {
        Firebase.loginG();
      },
       loginFb() {
        Firebase.loginFb();
      },
      loginT() {
        Firebase.loginT();
      },

      loginGit() {
        Firebase.loginGit();
      },

      loginEyC() {
        Firebase.loginEyC(this.usuario, this.contraseña);
      },
      

      logout(){
        Firebase.logout();
      },

      aviso(){
        if(!this.user.loggedIn){
          this.$notify({
            group: 'foo',
            type: 'warn',
            title: 'Inicia sesión',
            text: 'Para poder acceder al carrito debes iniciar sesión'
          });
        }
      }


      
    },
    computed: {
        authenticated(){
          return this.user.loggedIn
        },
        firstName(){
          if (this.user.data.displayName) {
            return this.user.data.displayName.split(' ')[0]
          }
          else if (this.user.data.email) {
            return this.user.data.email
          }
          return null
        },
        numProductos(){
          let articulos = 0;
          this.carro.forEach(art => {
              articulos += parseInt(art.cantidad);
          });
          return articulos;
        },
        precioTotal() {
          let precio = 0;
          this.carro.forEach(art => {
              precio += parseInt(art.cantidad)*parseInt(art.precio);
          });
          return precio;
        },

        admin(){
          if(this.user.data.email == "administrador@gmail.com"){
            return true;
          }
          else{
            return false;
          }
        }

      
    },
    firestore:
    {
      logo: db.collection('logo'),
      carro: db.collection('carrito').where("user", "==", Firebase.auth.currentUser ? Firebase.currentUser.email: "") 
    }

  }



</script>

<style lang="scss">
  
</style>
