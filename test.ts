import 'reflect-metadata'
import * as assert from 'assert'
import { Injectable, ReflectiveInjector } from './dist/bundle'

@Injectable()
class Engine {
	public isStarted = false
	start() {
		this.isStarted = true
	}
}

@Injectable()
class Car {
	constructor (public engine: Engine) {}
	run() {
		this.engine.start()
	}
}

const injector = ReflectiveInjector.resolveAndCreate([Car, Engine])
const car = injector.get(Car) as Car
car.run()

assert.ok(car instanceof Car, "Car is not an instance of Car")
assert.ok(car.engine.isStarted, "Car is not an instance of Car")

console.error('Passed.')
