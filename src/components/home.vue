<template lang="html">

  <section class="products">
    <novedad></novedad>
    <productos></productos>
  </section>

</template>

<script lang="js">
import productos from './productos'
import novedad from './novedad'
  export default  {
    name: 'home',
    props: [],

  components: {
    novedad,
    productos
  },
    mounted () {

    },
    data () {
      return {

      }
    },
    methods: {

    },
    computed: {

    }
}


</script>

<style scoped lang="scss">
  .home {

  }
</style>
