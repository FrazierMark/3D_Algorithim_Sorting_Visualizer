import EventEmitter from "./EventEmmiter"

export default class Sizes extends EventEmitter{
    
    constructor() {
        // Call super() to be able to overide the sizes constructor()
        // aka Calls event Emitter constructor methods
        super()

        // Sizes now has access to all the EventEmitter parameters


        //Setup
        this.width = window.innerWidth
        this.height = window.innerHeight
        this.pixelRatio = Math.min(window.devicePixelRatio, 2)
        // console.log(this)

        //Resize window event
        window.addEventListener('resize', () => {
            this.width = window.innerWidth
            this.height = window.innerHeight
            this.pixelRatio = Math.min(window.devicePixelRatio, 2)

            // When resized, call trigger() (from eventemitter)
            this.trigger('resize')
        })
    }
}