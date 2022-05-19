const {  
    mapActions, 
    mapGetters 
} = Vuex;

var componentButtonCart = {
    template: /*html*/`
        <a href="/cart" class="container-product-cart">
            <i class="material-icons cart">shopping_cart</i>
            <span class="items" ref="item_count" style="font-weight: bold;">0 Item</span>
            <span class="total" ref="total_price" style="font-weight: bold;">R$ 0,00</span>
        </a>
    `,
    delimiters: ['$(', ')'],
    data: () => ({
        header: "Carrinho",
    }),
    computed: {
        ...mapGetters([
          "getItemCountCart",
          "getTotalPriceCart",
        ])
    },
    watch: {
        getItemCountCart(newValue) {
            if (newValue == 1) {
              this.$refs.item_count.innerHTML = "1 Item"
            } else if (newValue > 1) {
              this.$refs.item_count.innerHTML = `${newValue} Itens`
            } else {
              this.$refs.item_count.innerHTML = '0 Item'
            }
        },
        getTotalPriceCart(newValue) {
            this.$refs.total_price.innerHTML = formatCurrency(newValue);
        },
    },
}