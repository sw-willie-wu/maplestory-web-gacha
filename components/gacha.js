import { ref, reactive } from 'vue'
import items from '../items.json' assert { type: "json" }

export default {
    setup() {
        const datas = reactive({
            rankS: items.filter((elem) => elem.rank === 'S'),
            rankA: items.filter((elem) => elem.rank === 'A'),
            rankB: items.filter((elem) => elem.rank === 'B'),
            rankC: items.filter((elem) => elem.rank === 'C'),
            counts: {},
            names: {}
        })
        items.map(elem => {
            datas.counts[elem.id] = 0
            datas.names[elem.id] = elem.name
        })

        const pool1 = items.reduce(function (prev, curr) {
            return [...prev, ...Array(curr.first_p * 100).fill(curr.id)]
        }, [])

        const pool2 = items.reduce(function (prev, curr) {
            return [...prev, ...Array(curr.last_p * 100).fill(curr.id)]
        }, [])

        // const superBuy = ref(false)
        const totalCost = ref(0)
        const bagCount = ref(10)
        const gachaCost = ref(99)
        const gachaCount = ref(1)
        const gachaReword = reactive([])
        const restartText = ref('超高CP值加購區!')

        const gacha1 = () => {
            let idx = pool1[Math.floor(Math.random() * pool1.length)]
            gachaCount.value = 1
            bagCount.value = 10
            gachaCost.value = 99
            datas.counts[idx] += 1
            gachaReword.length = 0
            gachaReword.push(datas.names[idx])
            totalCost.value += 19
        }

        const gacha10 = () => {
            if (gachaCount.value === 1) {
                gachaReword.length = 0
                for (let i = 0; i < 10; i++) {
                    let idx = pool1[Math.floor(Math.random() * pool1.length)]
                    datas.counts[idx] += 1
                    gachaReword.push(datas.names[idx])
                }
                totalCost.value += 99
            } else if (gachaCount.value === 2 && gachaReword.length < 3) {
                for (let i = 0; i < 5; i++) {
                    let idx = pool1[Math.floor(Math.random() * pool1.length)]
                    datas.counts[idx] += 1
                    gachaReword.push(datas.names[idx])
                }
                totalCost.value += 39
            } else if (gachaCount.value === 3 && gachaReword.length < 3) {
                for (let i = 0; i < 5; i++) {
                    let idx = pool2[Math.floor(Math.random() * pool2.length)]
                    datas.counts[idx] += 1
                    gachaReword.push(datas.names[idx])
                }
                totalCost.value += 29
                restartText.value = '重新開始!'
            }
        }

        const restartGacha = () => {
            if (gachaCount.value === 1 && gachaReword.length > 2) {
                gachaCount.value = 2
                bagCount.value = 5
                gachaCost.value = 39
                gachaReword.length = 0
            } else if (gachaCount.value === 2 && gachaReword.length > 2) {
                gachaCount.value = 3
                bagCount.value = 5
                gachaCost.value = 29
                gachaReword.length = 0
            } else if (gachaCount.value === 3 && gachaReword.length > 2) {
                gachaCount.value = 1
                bagCount.value = 10
                gachaCost.value = 99
                gachaReword.length = 0
                restartText.value = '超高CP值加購區!'
            }
        }
        return {
            datas, restartText, bagCount, gachaCost, totalCost, gachaCount, gachaReword, gacha1, gacha10, restartGacha
        }
    },
    template: `
    <div class="gacha-page">
        <div class="gacha-block" style="background-color: white;">
            <div class="row align-items-center" style="height: 35%;">
                <div class="col-2"></div>
                <div class="col-3">目前花費： <span style="color: green;">{{ totalCost }}</span></div>
            </div>
            <div class="row justify-content-center">
                <div class="col-4 d-flex justify-content-center">
                    <button class="btn btn-primary" style="width: 200px;"
                    @click="gacha1">購買1個福袋&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span style="color:yellow;">19NT</span></button>
                </div>
                
                <div class="col-4 d-flex justify-content-center">
                    <button class="btn btn-primary" style="width: 200px;" @click="gacha10">購買{{ bagCount
                    }}個福袋&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span style="color:yellow;">{{ gachaCost }}NT</span></button>
                </div>
                
                <div class="col-12" :class="[gachaReword.length === 0 ? 'hide-reword' : 'show-reword']">
                    <div class="row align-items-center" style="height: 100px;">
                        <div class="col d-flex justify-content-center" v-for="elem in gachaReword">
                            <div style="width: 100%; font-size: .5rem; text-align: center;">{{ elem }}</div>
                        </div>
                    </div>
                </div>
                
                <div class="col-4 d-flex justify-content-center">
                    <button class="btn btn-info" style="width: 200px;">回收/領取獎勵</button>
                </div>
                
                <div class="col-4 d-flex justify-content-center">
                    <button class="btn" :class="[gachaReword.length < 3 ? 'btn-secondary' : 'btn-danger']" style="width: 200px;"
                    @click="restartGacha"> {{ restartText }}</button>
                </div>
            </div>
        </div>
        
        <br><br><br>

        <div class="row">
            <div class="col-12">
                <h3 style="text-align: center;"><b>結果統計：</b></h3>
            </div>
            
            <div class="col-3">
                <div class="row align-items-center" v-for="elem in datas.rankS"
                style="height: 3rem; border: 1px solid; background-color: white;">
                    <div class="col-2"><img :src="'imgs/' + elem.id + '.png'"></div>
                    <div class="col-9">{{ elem.name }}</div>
                    <div class="col-1" style="margin-left: -10px;">{{ datas.counts[elem.id] }}</div>
                </div>
            </div>
            
            <div class="col-3">
                <div class="row align-items-center" v-for="elem in datas.rankA"
                style="height: 3rem; border: 1px solid;background-color: white;">
                    <div class="col-2"><img :src="'imgs/' + elem.id + '.png'"></div>
                    <div class="col-9">{{ elem.name }}</div>
                    <div class="col-1" style="margin-left: -10px;">{{ datas.counts[elem.id] }}</div>
                </div>
            </div>
    
            <div class="col-3">
                <div class="row align-items-center" v-for="elem in datas.rankB"
                style="height: 3rem; border: 1px solid;background-color: white;">
                    <div class="col-2"><img :src="'imgs/' + elem.id + '.png'"></div>
                    <div class="col-9">{{ elem.name }}</div>
                    <div class="col-1" style="margin-left: -10px;">{{ datas.counts[elem.id] }}</div>
                </div>
            </div>
    
            <div class="col-3">
                <div class="row align-items-center" v-for="elem in datas.rankC"
                style="height: 3rem; border: 1px solid;background-color: white;">
                    <div class="col-2"><img :src="'imgs/' + elem.id + '.png'"></div>
                    <div class="col-9">{{ elem.name }}</div>
                    <div class="col-1" style="margin-left: -10px;">{{ datas.counts[elem.id] }}</div>
                </div>
            </div>
        </div>
        <br><br><br>
    </div>`
}