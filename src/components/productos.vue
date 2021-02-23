<template>
      <section>
          <div v-if="load" class="d-flex justify-content-center mb-3">
            <b-spinner label="Loading..."></b-spinner>
          </div>
        
    <section class="products" v-if="datos!=null">
        
            <div class="products-heading">
        <h1 class="products-heading-text">Productos</h1>
    </div>
      <div class="products-wraper">
        <div class="product" v-for="(jabon, index) in datos" v-bind:key="index">
                <img v-bind:src="jabon.img" class="product-img">
                <h2 class="product-description-heading">
                  {{jabon.nombre}}
                </h2>
                <p class="product-description-text">
                  {{jabon.descripcion}}
                </p>
                <p class="product-description-stock">
                    Nos quedan <span>{{jabon.stock}}</span> en stock
                </p>
                <p class="product-description-price">
                    PVP: <span>{{jabon.precio}}€</span>
                </p>
                <a  class="product-description-btn"
                v-on:click="anadeCarrito(jabon)">
                    Compra ahora
                </a>
        </div>
      </div>

</section>
</section>
        
    
</template>

<script lang="js">
import {db} from '../db'
import Firebase from '../db'


  export default  {
    name: 'productos',
    props: [],
    mounted () {
      Firebase.auth.onAuthStateChanged( user => {
        if (user) {
          this.user.loggedIn = true;
          this.user.data = user;
          
        }
        else {
          this.user.loggedIn = false;
          this.user.data = {};
          this.$router.push('/');
          
        }
      });
    },
    data () {
      return {
        datos: null,
        carrito: null,
        user: {
          loggedIn: false,
          data: {}
        },
      }
    },
    methods: {
      anadeCarrito(jabon){
        if(this.user.loggedIn == false){
          this.$notify({
            group: 'foo',
            type: 'error',
            title: 'Autentifícate',
            text: jabon.nombre+' no se puede añadir a la cesta porque no te has autentificado'
          });
        } else{
          if (jabon.stock>0){
          var stockD = jabon.stock;
          var cant = 0;
          var idP = 0;
          stockD --;
        db.collection('jabones').doc(jabon.id).update({ stock: stockD });
        this.carrito.filter((producto)=>
        {
          if(producto.nombre==jabon.nombre){
            cant = producto.cantidad;
            idP = producto.id;
          }

        });

        if (cant == 0){
          db.collection('carrito').add({
            img: jabon.img,
            nombre: jabon.nombre,
            stock: jabon.stock,
            precio: jabon.precio,
            cantidad: 1,
            idP: jabon.id,
            user: Firebase.auth.currentUser.email
          });
        }
        else {
          cant ++;
          db.collection('carrito').doc(idP).update({ cantidad:  cant});
          db.collection('carrito').doc(idP).update({ stock:  stockD});
        }
        this.$notify({
            group: 'foo',
            type: 'success',
            title: 'Añadido',
            text: jabon.nombre+' se ha añadido a la cesta'
          });
        }
        else{
          this.$notify({
            group: 'foo',
            type: 'error',
            title: 'Fuera de stock',
            text: jabon.nombre+'no se puede añadir a la cesta porque no queda stock'
          });
        }
        }
        
      }
    },
    computed: {
       load(){
        if(!this.datos){
          return true;
        }
        else {
          return false;
        }
      }
      
    },

    firestore:
    {
      datos: db.collection('jabones'),
      carrito: db.collection('carrito').where("user", "==", Firebase.auth.currentUser ? Firebase.currentUser.email: "") 
    }
}


</script>

<style>
  .productos {

  }
</style>
