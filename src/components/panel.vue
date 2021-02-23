<template>

  <section class="panel">
    <hr>
    <h2>Panel</h2>
    <table class="panel-table">
      <tr>
        <th>Imagen</th>
        <th>Producto</th>
        <th>Descripcion</th>
        <th>Precio</th>
        <th>Stock</th>
        <th>Novedad</th>
      </tr>
      <tr v-for="(jabon, index) in jabones" v-bind:key="index">
        <td v-if="edita!=jabon.id"><img v-bind:src="jabon.img" class="carrito-img"></td>
        <td v-else-if="edita==jabon.id">
          <input type="file" ref="input1"  @change="previewImage" accept="image/*" > 
              <input type="button" @click="subir" value="Sube la foto del producto">                   
          <div v-if="imageData!=null"> 
              
              <img class="preview" height="268" width="356" :src="img1">
          <br>
          </div>
        </td>
        <td v-if="edita!=jabon.id">{{jabon.nombre}}</td>
        <td v-else-if="edita==jabon.id"><input type="text" v-model="nom" :placeholder="jabon.nombre"></td>
        <td v-if="edita!=jabon.id">{{jabon.descripcion}}</td>
        <td v-else-if="edita==jabon.id"><input type="text" v-model="desc"></td>
        <td v-if="edita!=jabon.id">{{jabon.precio}} €</td>
        <td v-else-if="edita==jabon.id"><input type="number" v-model="precio"></td>
        <td v-if="edita!=jabon.id">{{jabon.stock}}</td>
        <td v-else-if="edita==jabon.id"><input type="number" v-model="cant"></td>
        <td v-if="edita!=jabon.id">{{jabon.novedad}}</td>
        <td v-else-if="edita==jabon.id"><input type="boolean" v-model="nov"></td>

        <td><i class="fas fa-trash-alt" v-on:click="borraProducto(jabon)"></i></td>
        <td><i class="fas fa-edit" v-on:click="editaP(jabon)" v-if="edita!=jabon.id"></i><i class="fas fa-save" v-if="edita==jabon.id" @click="editaProducto(jabon.id)"></i></td>
      </tr>
      <tr class="panel-table-plus">
        <td colspan="6">  <i class="fas fa-plus-square" v-on:click="anadeP"></i> </td>
      </tr>
    </table>
    <div v-if="anade">
      <b-container fluid>
  

        <b-row class="my-1">
          <b-col sm="2">
            <label for="nombre">Nombre:</label>
          </b-col>
          <b-col sm="10">
            <b-form-input id="nombre" size="lg" placeholder="Nombre del producto" v-model="name"></b-form-input>
          </b-col>
        </b-row>

        <b-row class="my-1">
          <b-col sm="2">
            <label for="descripcion">Descripcion:</label>
          </b-col>
          <b-col sm="10">
            <b-form-input id="descripcion" size="lg" placeholder="Descripción del producto" v-model="description"></b-form-input>
          </b-col>
        </b-row>

        <b-row class="my-1">
          <b-col sm="1">
            <label for="price">Precio:</label>
          </b-col>
          <b-col sm="3">
            <b-form-input type="number" id="price" size="lg" placeholder="Precio del producto" v-model="price"></b-form-input>
          </b-col>

          <b-col sm="1">
            <label for="stock">Stock:</label>
          </b-col>
          <b-col sm="3">
            <b-form-input id="stock" size="lg" placeholder="Stock del producto" v-model="stock"></b-form-input>
          </b-col>

          <b-col sm="1">
            <label for="novedad">Novedad:</label>
          </b-col>
          <b-col sm="3">
            <b-form-select v-model="novedad" :options="options"></b-form-select>
          </b-col>

        </b-row>

        <b-row class="my-1">
          
           <b-col sm="6">
           <input type="file" ref="input1"  @change="previewImage" accept="image/*" >               
         </b-col>

         <b-col sm="6">
           <input type="button" @click="subir" value="Sube la foto del producto">
           </b-col>
        </b-row>
        

        <b-row class="my-1">
          <div v-if="imageData!=null">                     
              <img class="preview" height="268" width="356" :src="img1">
          <br>
          </div> 
        </b-row>
        <b-row class="my-1">
          <b-col sm="12">
          <input class="panel-btn" type="submit" value="Guarda producto" @click="subeProducto">
          </b-col>
        </b-row>
      </b-container>
     

    </div>
  </section>
</template>

<script lang="js">
import {storage} from '../db'    
import {db} from '../db'


  export default  {
    name: 'panel',
    props: [],
    mounted () {

    },
    data () {
      return {
        jabones: null,
        anade: false,
        imageData: null,
        img1: null,
        name:"",
        description: "",
        price: "",
        stock: "",
        img: "",
        novedad: false,
        options: [
          { value: true, text:true },
          { value: false, text:false }
        ],
        nom: "",
        desc: "",
        precio: 0,
        cant: 0,
        nov: false,
        edita: ""
        }
    },
    methods: {
      anadeP(){
        this.anade = true;
      },


      previewImage: function(event){
        this.uploadValue=0;          
        this.imageData = event.target.files[0];
        var reader = new FileReader();

        reader.onload = (e) => {
           this.img1 = e.target.result;
        }
        reader.readAsDataURL(this.imageData);

      },
      subir(){
         
          const storageRef=storage.ref(this.imageData.name).put(this.imageData);
          
          storageRef.on(`state_changed`,snapshot=>{
          this.uploadValue = (snapshot.bytesTransferred/snapshot.totalBytes)*100;
          console.log(this.uploadValue)
            }, error=>{console.log(error.message)},
          ()=>{this.uploadValue=100;
              storageRef.snapshot.ref.getDownloadURL().then((url)=>{
                  this.img = url;
                  this.img1=null;
                  this.imageData = null;
                  this.$notify({
                    group: 'foo',
                    title: 'Se ha subido el archivo',
                    type: 'success',
                    text: 'El archivo se ha subido correctamente'
                  });
                });
              }      
            ); 
        },

      subeProducto(){
       db.collection('jabones').add({
            img: this.img,
            nombre: this.name,
            stock: this.stock,
            precio: this.price,
            descripcion: this.description,
            novedad: this.novedad
          });
          

          this.img= "";
          this.name="";
          this.stock="";
          this.price="";
          this.description="";

      },

      borraProducto(jabon){
        db.collection('jabones')
        .doc(jabon.id)
        .delete();

        this.$notify({
                    group: 'foo',
                    title: 'Se ha eliminado el producto',
                    type: 'success',
                    text: 'El producto se ha eliminado correctamente'
                  });
      },

      editaP(jabon){
        this.edita= jabon.id;
        this.nom = jabon.nombre;
        this.desc = jabon.descripcion;
        this.precio = jabon.precio;
        this.cant = jabon.stock;
        this.nov = jabon.novedad;
      },

      editaProducto(idJ){
        db.collection('jabones')
        .doc(idJ)
        .update({
          descripcion: this.desc,
          nombre: this.nom,
          precio: this.precio,
          stock: this.cant,
          novedad: this.nov,
          img: this.img
        });

        this.edita = "";
        this.$notify({
                    group: 'foo',
                    title: 'Se ha editado el producto',
                    type: 'success',
                    text: 'El producto se ha editado correctamente'
                  });

      }
  

    },

    
    computed: {

    },
    firestore:
    {
      jabones: db.collection('jabones')
    }
}


</script>

<style scoped lang="scss">
  .panel {

  }
</style>
