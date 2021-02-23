<template>

  <section class="carrito">
    <hr>
    <h2>Carrito</h2>
    <table class="carrito-table">
      <tr>
        <th>Imagen</th>
        <th>Producto</th>
        <th>Precio Unitario</th>
        <th>Cantidad</th>
        <th>Total</th>
      </tr>
      <tr v-for="(carro, index) in carrito" v-bind:key="index">
        <td><img v-bind:src="carro.img" class="carrito-img"></td>
        <td>{{carro.nombre}}</td>
        <td>{{carro.precio}} €</td>
        <td><input class="carrito-cantidad" :disabled="disabled == 1" type="number" min="1" v-bind:value="carro.cantidad" v-on:change="actualizaCantidad(carro.id, $event.target.value, carro.cantidad, carro.stock, carro.idP)"></td>
        <td>{{parseInt(carro.precio)*parseInt(carro.cantidad)}} €</td>
        <td><i class="fas fa-trash-alt" v-on:click="borraProducto(carro)"></i></td>
        
      </tr>
      <tr class="carrito-table-total">
        <td colspan="4">TOTAL: </td>
        <td>{{precioTotal}}€</td>
      </tr>
      
        <button @click="borraCarrito">Realizar Pedido</button>
      
    </table>
  </section>

</template>

<script lang="js">
import {db} from '../db'
 import Firebase from '../db'

  export default  {
    name: 'carrito',
    props: [],
    mounted () {
       Firebase.auth.onAuthStateChanged( user => {
        if (user) {
          this.user.loggedIn = true;
          this.user.data = user;
          this.$bind("carrito", db.collection('carrito').where("user", "==", Firebase.auth.currentUser.email))
        }
        else {
          this.user.loggedIn = false;
          this.user.data = {};
          this.$router.push('/');
          this.$bind("carrito", db.collection('carrito').where("user", "==", ""))
        }
      });

    },
    data () {
      return {
        carrito:[],
        productos: [],
        user: {
          loggedIn: false,
          data: {}
        },
        disabled: 0,
      }
    },

    methods: {
      actualizaCantidad(idP, valor, cantidad, stock, idPr){
        
        if(cantidad>valor){
          stock ++;
          db.collection('carrito').doc(idP).update({ stock: stock});
          db.collection('jabones').doc(idPr).update({ stock: stock});
          db.collection('carrito').doc(idP).update({ cantidad:  valor});
        }
        else if(valor>cantidad){
          if(stock>0){
            stock--;
            db.collection('carrito').doc(idP).update({ stock: stock});
            db.collection('jabones').doc(idPr).update({ stock: stock});
            db.collection('carrito').doc(idP).update({ cantidad:  valor});

          }
          else{
            this.disable = 1;
            this.$notify({
            group: 'foo',
            type: 'error',
            title: 'Fuera de stock',
            text: 'No se pueden añadir más a la cesta porque no queda en stock'
          });
          }
          
        }
       
      },

      borraProducto(carro){
        db.collection('carrito')
        .doc(carro.id)
        .delete();
        db.collection('jabones').doc(carro.idP).update({ stock: parseInt(carro.stock)+parseInt(carro.cantidad)});
      },

      borraCarrito(){
        this.carrito.forEach(jabon => {
          db.collection("carrito").doc(jabon.id).delete();
        });
      }

      
      

    },
    computed: {
      precioTotal(){
        let carroTotal= 0;
          this.carrito.forEach(art => {
            carroTotal += art.precio*art.cantidad;
          });
        return carroTotal;
      }
    },

    firestore:
    {
      carrito: db.collection('carrito').where("user", "==", Firebase.auth.currentUser ? Firebase.auth.currentUser.email: "") ,
      productos: db.collection('jabones')
    },

    filters:
    {

    }
}


</script>

<style scoped lang="scss">
  .carrito {

  }
</style>
