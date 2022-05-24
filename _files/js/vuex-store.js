var store = Vuex.createStore({
    state () {
        return {
        header: "Vuex",
        product: {
            open: false,
            variants: [],
            options: [],
            media: [],
            media_ids: [],
            title: '',
            description: '',
            price: 0,
            price_compare: 0,
        },
        form: {
            selections: [],
            options: [],
        },
        cart: {
            products: [],
            // freight:    0,
            item_count: 0,
            // discount:   0,
            total_price:   0,
        },
        }
    },
    mutations: {
        SET_STATE(state, payload) {
        Object.keys(payload).forEach(
            (keysString) => {
                let keys = keysString.split('.')
                let lastKey = keys.pop();
                let ref = state;
                keys.forEach(
                    (key) => {
                        ref = ref[key];
                    }
                )
                ref[lastKey] = payload[keysString]
            }
        )
        },
    },
    actions: {
        setHeader({commit}, payload) {
            commit('SET_STATE', {
                header: payload,
            })
        },
        setProduct({commit}, product_handle) {
            return new Promise(
                async (resolve, reject) => {
                    try {
                        let response = await axios.get(`/products/${product_handle}.js`)
                        let product = response.data;
                        let media = [];
                        let media_ids = [];
                        product.media.forEach(
                        (m) => {
                            if (media_ids.includes(m.id)) return;
                            media.push(m);
                            media_ids.push(m.id);
                        }
                        );
                        if (product.hasOwnProperty('variants')) {
                        product.variants.forEach(
                            (v) => {
                            let m = v.featured_media;
                            if (media_ids.includes(m.id)) return;
                            media.push(m);
                            media_ids.push(m.id);
                            }
                        );
                        }
                        console.log("setProduct - response", product)
                        commit('SET_STATE', {
                            "product.media": media,
                            "product.media_ids": media_ids,
                            "product.options": product.options,
                            "product.title": product.title,
                            "product.price": product.price,
                            "product.description": product.description,
                            "product.price_compare": product.compare_at_price,
                            "product.variants": product.variants,
                        })
                        resolve(true)
                    } catch (error) {
                        reject(error)
                    }
                }
            )
        },
        setCartProducts({commit}) {
            return new Promise(
                async (resolve, reject) => {
                    try {
                        let response = await axios.get(
                            `/cart.js`
                        )
                        commit('SET_STATE', {
                            "cart.products":    response.data.items,
                            "cart.item_count":  response.data.item_count,
                            "cart.total_price": response.data.total_price,
                        })
                        resolve(true)
                    } catch (e) {
                        reject(e)
                    }
                }
            )
        },
        addProductToCart({state, commit}, payload) {
            return new Promise(
                async (resolve, reject) => {
                    try {
                        let { variantID, quantity } = payload;
                        let data = {
                            id: variantID,
                            quantity: quantity,
                        }
                        let response = await axios.post(
                            '/cart/add.js',
                            data
                        )
                        console.log("addProductToCart - response", response)
                        resolve(true)
                    } catch (e) {
                        reject(e)
                    }
                }
            );
        },
    },
    getters: {
        getHeader: state => state.header,
        // getProduct: state => state.product,
        // -----------------------------------------------------
        // Cart
        getItemCountCart: state => state.cart.item_count,
        getTotalPriceCart: state => state.cart.total_price,
        getProductsCart: state => state.cart.products,
        // -----------------------------------------------------
        // Product
        getProductPrice:        state => state.product.price,
        getProductMedia:        state => state.product.media,
        getProductOptions:      state => state.product.options,
        getProductDescription:  state => state.product.description,
        getProductVariants:     state => state.product.variants,
    }
})