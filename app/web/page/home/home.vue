<template>
    <IndexLayout>
        <navs />
    </IndexLayout>
</template>
<script type="text/babel">
    import Vue from "vue"
    import ElementUI from "element-ui"
    import { sync } from "vuex-router-sync"
    import "element-ui/lib/theme-chalk/index.css"
    import createStore from "./store/app"
    import createRouter from "./router"
    import IndexLayout from "component/layout/index"
    import navs from "./view/nav.vue"
    import io from "socket.io-client"

    Vue.use(ElementUI)

    const store = createStore()
    const router = createRouter()
    sync(store, router)

    export default {
      router,
      store,
      data() {
        return {
          globalWebsocket: null
        }
      },
      components: {
        IndexLayout,
        navs
      },
      mounted() {
        this.startWsConnection()
      },
      methods: {
        setWebsocket(w) {
          this.globalWebsocket = w
        },
        stopWsConnection() {
          if (this.globalWebsocket) {
            this.globalWebsocket.close()
            this.setWebsocket(null)
          }
        },
        startWsConnection() {
          this.stopWsConnection()
          let self = this
          let curMode = process.env.NODE_ENV
          let ws = io(`/`)

          ws.on("connect", () => {
            console.log(`websocket successfully connected ${self.shopId}`)
          })
          ws.on("new", msg => {
            if (msg.data.shop_id == self.shopId) {
              self.parseShownPersonToList(msg.data)
            }
          })
          ws.on("update", msg => {
            self.updateShownPerson(msg)
          })
          ws.on("leave", msg => {
            self.deleteShownPersonInList(msg.person_id)
          })
          ws.on("alarm", msg => {
            let p = self.peopleList.find((li, index) => {
              return li.personId == msg.person_id
            })
            if (p) {
              self.alarmShownPersonCard(msg, p)
            }
          })
          ws.on("disconnect", () => {
            console.log("websocket successfully closed")
          })
          this.setWebsocket(ws)
          window.ws = ws
        }
      }
    }
</script>
