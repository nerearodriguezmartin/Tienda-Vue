<template lang="html">
  <section>
          <div v-if="load" class="d-flex justify-content-center mb-3">
            <b-spinner label="Loading..."></b-spinner>
          </div>
          
    <section class="slideshow" v-if="novedades!=null">
        <div  class="slideshow-slide" v-for="(novedad, index) in novedades" v-bind:key="index">
        <div class="slideshow-content">
            <h2>{{novedad.nombre}}</h2>
            <p>{{novedad.descripcion}}</p>
            <a class="product-description-btn"  v-on:click="anadeCarrito(novedad)">
                    Compra ahora
                </a>
        </div>
        <img :src="novedad.img">
    
      </div>
    
  </section>
  </section>
  

</template>

<script lang="js">

// import {storage} from '../db'
 import {db} from '../db'
 import Firebase from '../db'

  export default  {
    name: 'novedad',
    props: [],
    mounted () {

    },
    data () {
      return {
        novedades: null,
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
        if(!this.novedades){
          return true;
        }
        else {
          return false;
        }
      }

    },

    firestore:
    {
      novedades: db.collection('jabones').where("novedad", "==", true),
       carrito: db.collection('carrito').where("user", "==", Firebase.auth.currentUser ? Firebase.currentUser.email: "") 
    }
}


</script>

<style scoped lang="scss">
  .novedad {

  }
</style>
