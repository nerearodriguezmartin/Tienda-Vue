<template>

  <section class="registro">
    <form>
        <b-row class="my-1">
          <b-col sm="2">
            <label for="nombre">Nombre y apellidos:</label>
          </b-col>
          <b-col sm="10">
            <b-form-input type="text" id="nombre" nombre="nombre" v-model="nombre"></b-form-input>
          </b-col>
        </b-row>
        <b-row class="my-1">
          <b-col sm="2">
            <label for="usuario">Usuario:</label>
          </b-col>
          <b-col sm="10">
            <b-form-input type="email" id="usuario" nombre="usuario" v-model="usuario"></b-form-input>
          </b-col>
        </b-row>

        <b-row class="my-1">
          <b-col sm="2">
            <label for="contraseña">Contraseña:</label>
          </b-col>
          <b-col sm="10">
            <b-form-input type="password" id="contraseña" nombre="contraseña" v-model="contraseña"></b-form-input>
          </b-col>
        </b-row>
        <button class="registro-btn" @click="checkinEyC">Registrar</button>
    </form>

  </section>

</template>

<script lang="js">
 import Firebase from '../db'
  export default  {
    name: 'registro',
    props: [],
    mounted () {

    },
    data () {
      return {
        nombre: "",
        usuario: "",
        contraseña: ""
      }
    },
    methods: {
      checkinEyC(){
        if (this.nombre && this.usuario && this.contraseña){
             Firebase.registroEyC(this.usuario, this.contraseña);
          this.$notify({
                group: 'foo',
                type: 'success',
                title: 'Bienvenido',
                text: 'El registro se ha procesado correctamente'
              })
        }
        else
        {
        this.$notify({
          group: 'foo',
          type: 'error',
          title: 'Algo ha ido mal',
          text: 'Comprueba que se hayan completado todos los campos correctamente'
        });
        }
       }
    },
    computed: {

    }
}


</script>

<style scoped lang="scss">
  .registro {

  }
</style>
