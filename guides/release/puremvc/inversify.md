![InversifyJS](/images/puremvc/gestalt/inversifyjs.jpg)

## О InversifyJS

Представляем в этой главе адаптированный перевод
[статьи](https://www.codeproject.com/Articles/1085306/Introducing-InversifyJS-A-powerful-lightweight-IoC)
и этой [статьи](https://www.methodsandtools.com/tools/inversifyjs.php)

InversifyJS is a powerful lightweight (4KB) pico inversion of control (IoC) container for TypeScript and JavaScript apps. A pico IoC container uses a class constructor to identify and inject its dependencies. InversifyJS also uses annotations to identify and inject its dependencies. InversifyJS has a friendly API and encourage the usage of the best OOP and IoC practices.

## Motivation

JavaScript applications are becoming larger and larger day after day. InversifyJS has been designed to allow JavaScript developers to write code that adheres to the SOLID principles.

The main goal of Inversion of control and Dependency Injection is to remove dependencies of an application. This makes the system more decoupled and maintainable.

* What is Inversion of Control (IoC)

In traditional programming, the flow of the business logic is determined by objects that are statically assigned to one another. With inversion of control, the flow depends on the object graph that is instantiated by the assembler and is made possible by object interactions being defined through abstractions. The binding process is achieved through dependency injection, although some argue that the use of a service locator also provides inversion of control.

Inversion of control as a design guideline serves the following purposes:

There is a decoupling of the execution of a certain task from implementation. Every module can focus on what it is designed for. Modules make no assumptions about what other systems do but rely on their contracts. Replacing modules has no side effect on other modules.

* What is Dependency Injection (DI)

IoC is a design paradigm with the goal of giving more control to the targeted components of your application, the ones getting the work done. While Dependency injection is a pattern used to create instances of objects that other objects rely on without knowing at compile time which class will be used to provide that functionality. IoC relies on dependency injection because a mechanism is needed in order to activate the components providing the specific functionality.

The two concepts work together in this way to allow for much more flexible, reusable, and encapsulated code to be written. As such, they are important concepts in designing object-oriented solutions.

* How to implement IoC

In object-oriented programming, there are several basic techniques to implement inversion of control. These are:

* using a factory pattern
* using a service locator pattern
* using a dependency injection of any given below type:
* a constructor injection
* a setter injection
* an interface injection

We're going to show you an example based on a node demo project which consists of a service class depending on two other classes, and the main file which is utilizing this service.

Now that ECMAScript 2015 version of JavaScript supports classes and that TypeScript brings static types to JavaScript application, the SOLID principles have become more relevant than ever before in the development of JavaScript applications.

At the time there was some IoC containers available for JavaScript applications but none of them were able to provide a developer experience as rich as We were expecting so We decided to try to develop something that would suit my needs.

The first commit to the InversifyJS core library took place the 7th of Apr 2015 and the version 1.0.0 was released on npm 10 days later. The version 2.0.0 was released the 11th of Sep 2016, after a year of development. The most recent release (3.3.0 at the time in which this article was published) was published in March 2017. Since the first release the project has earned over 1000 stars on GitHub, over 30 contributors and almost 25K monthly downloads on npm.

## Philosophy

InversifyJS has been developed with 3 main goals:

1. Allow JavaScript developers to write code that adheres to the SOLID principles.

2. Facilitate and encourage the adherence to the best OOP and IoC practices.

3. Add as little runtime overhead as possible.

4. Provide a state of the art development experience.

## Dependencies

InversifyJS requires a modern JavaScript engine with support for:

* [Reflect metadata](https://rbuckton.github.io/reflect-metadata/)
* [Map](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map)
* [Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) (Only required if using [provider injection](https://github.com/inversify/InversifyJS/blob/master/wiki/provider_injection.md))
* [Proxy](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Proxy) (Only required if using [activation handlers](https://github.com/inversify/InversifyJS/blob/master/wiki/activation_handler.md))

Check out the [Environment support and polyfills](https://github.com/inversify/InversifyJS/blob/master/wiki/environment.md) page in the wiki and the [Basic example](https://github.com/inversify/inversify-basic-example) to learn more.

## The Basics

Let's take a look to the basic usage and APIs of InversifyJS with TypeScript:

### Step 1: Declare your interfaces

Our goal is to write code that adheres to the
[dependency inversion principle](https://en.wikipedia.org/wiki/Dependency_inversion_principle).
This means that we should "depend upon Abstractions and do not depend upon concretions". Let's start by declaring some interfaces (abstractions).

The first we need to add reflect-metadata before all other our code
```javascript
import "reflect-metadata";
```

```javascript
interface Warrior {
    fight(): string;
    sneak(): string;
}

interface Weapon {
    hit(): string;
}

interface ThrowableWeapon {
    throw();
}
```

InversifyJS need to use the type as identifiers at runtime. We use symbols as identifiers but you can also use classes and or string literals.

```js
const TYPES = {
    Warrior: Symbol.for("Warrior"),
    Weapon: Symbol.for("Weapon"),
    ThrowableWeapon: Symbol.for("ThrowableWeapon")
};
export { TYPES };
```

> Note: It is recommended to use Symbols but InversifyJS also support the usage of Classes and string literals (please refer to the features section to learn more).

### Step 2: Implement the interfaces and declare dependencies using the `@inject` decorator

Let's continue by declaring some classes (concretions). The classes are implementations of the interfaces that we just declared. All the classes must be annotated with the `@injectable` decorator.

```javascript
import { interfaces, injectable, inject, Container } from "inversify";

@injectable()
class Katana implements Weapon {
    public hit() {
        return "cut!";
    }
}

@injectable()
class Shuriken implements ThrowableWeapon {
    public throw() {
        return "hit!";
    }
}

@injectable()
class Ninja implements Warrior {

    private _katana: Weapon;
    private _shuriken: ThrowableWeapon;

    public constructor(
      @inject(TYPES.Weapon) katana: Weapon,
      @inject(TYPES.ThrowableWeapon) shuriken: ThrowableWeapon
    ) {
        this._katana = katana;
        this._shuriken = shuriken;
    }

    public fight() { return this._katana.hit(); };
    public sneak() { return this._shuriken.throw(); };

}
```

### Step 3: Create and configure a Container

We recommend to do this in a file named inversify.config.ts. This is the only place in which there is some coupling. In the rest of your application your classes should be free of references to other classes.

```javascript
import { Container } from "inversify";

import { Ninja } from "./entities/ninja";
import { Katana } from "./entities/katana";
import { Shuriken } from "./entities/shuriken";

const myContainer = new Container();
myContainer.bind<Warrior>(TYPES.Warrior).to(Ninja);
myContainer.bind<Weapon>(TYPES.Weapon).to(Katana);
myContainer.bind<ThrowableWeapon>(TYPES.ThrowableWeapon).to(Shuriken);

export default myContainer;
```

### Step 4: Resolve dependencies

You can use the method `get<T>` from the `Container` class to resolve a dependency. Remember that you should do this only in your [composition root](http://blog.ploeh.dk/2011/07/28/CompositionRoot/) to avoid the [service locator anti-pattern](http://blog.ploeh.dk/2010/02/03/ServiceLocatorisanAnti-Pattern/).

```javascript
import myContainer = from "./inversify.config";

const ninja = myContainer.get<Warrior>(TYPES.Warrior);

expect(ninja.fight()).eql("cut!"); // true
expect(ninja.sneak()).eql("hit!"); // true
```

As we can see the `Weapon` and `ThrowableWeapon` were successfully resolved and injected into `Ninja`.

### The preceding file performs the following of tasks:

1. Import the required dependencies “reflect-metadata” and “inversify”.
2. Declare some interfaces and some types. Types are unique identifiers used to represent interfaces at runtime. We need these unique identifiers because TypeScript is compiled into JavaScript and JavaScript does not have support for static types like interfaces. We use types to identify which types need to be injected into a class.
3. Declare some classes that implement the interfaces that we previously declared. These classes will be instantiated by the IoC container and for that reasons they require to be decorated using the “@injectable” decorator. We also need to use the “@inject” decorator to indicate which types need to be injected into a class.
4. Declare an instance of the “Container” class and then declares some type bindings. A type bindings is a dictionary entry that links an abstraction (type) with an implementation (concrete class).
5. Use the IoC container instance previously declared to resolve the “Warrior” type. We declared a type binding between the “Warrior” type and the “Ninja” class so we can expect the IoC container to return an instance of the “Ninja” class. Because the “Ninja” class has a dependency in the “Weapon” and “ThrowableWapon” types and we declared some bindings for those types we can expect instances of the “Katana” and “Shuriken” classes to be instantiated and injected into the “Ninja” class.
6. Use the “log” method from the “console” object to check that instances of the Katana” and “Shuriken” has been correctly injected into the “Ninja” instance.

## The Basics (JavaScript)

It is recommended to use TypeScript for the best development experience but you can use plain JavaScript if you preffer it. The following code snippet implements the previous example without TypeScript in Node.js v5.71:

```javascript
const inversify = require("inversify");
require("reflect-metadata");

var TYPES = {
    Ninja: "Ninja",
    Katana: "Katana",
    Shuriken: "Shuriken"
};

class Katana {
    hit() {
        return "cut!";
    }
}

class Shuriken {
    throw() {
        return "hit!";
    }
}

class Ninja {
    constructor(katana, shuriken) {
        this._katana = katana;
        this._shuriken = shuriken;
    }
    fight() { return this._katana.hit(); };
    sneak() { return this._shuriken.throw(); };
}

// Declare injections
inversify.inject(TYPES.Katana, TYPES.Shuriken)(Ninja);

// Declare bindings
const myContainer = new inversify.Container();
myContainer.bind(TYPES.Ninja).to(Ninja);
myContainer.bind(TYPES.Katana).to(Katana);
myContainer.bind(TYPES.Shuriken).to(Shuriken);

// Resolve dependencies
const ninja = myContainer.get(TYPES.Ninja);
return ninja;
```

## Node.js enterprise patterns

What we just saw in the previous section of this article is a basic demo of the core InversifyJS API. When we implement a real world enterprise Node.js application using TypeScript and InversifyJS with Express.js we will end up writing some code that looks as follows:

```javascript
import * as express from "express";
import { Response, RequestParams, Controller, Get, Post, Put } from "inversify-express-utils";
import { injectable, inject } from "inversify";
import { interfaces } from "./interfaces";
import { Type } from "./types";
import { authorize } from "./middleware";
import { Feature } from "./features";

@injectable()
@Controller(
  "/api/user",
  authorize({ feature: Feature.UserManagement })
)
class UserController {
  @inject(Type.UserRepository) private readonly _userRepository: interfaces.UserRepository;
  @inject(Type.Logger) private readonly _logger: interfaces.Logger;

  @Get("/")
  public async get(
    @Request() req: express.Request,
    @Response() res: express.Response
  ) {
    try {
      this._logger.info(`HTTP ${req.method} ${req.url}`);
      return await this._userRepository.readAll();
    } catch (e) {
      this._logger.error(`HTTP ERROR ${req.method} ${req.url}`, e);
      res.status(500).json([]);
    }
  }

  @Get("/:email")
  public async getByEmail(
    @RequestParams("email") email: string,
    @Request() req: express.Request,
    @Response() res: express.Response
  ) {
    try {
      this._logger.info(`HTTP ${req.method} ${req.url}`);
      return await this._userRepository.readAll({ where: { email: email } });
    } catch (e) {
      this._logger.error(`HTTP ERROR ${req.method} ${req.url}`, e);
      res.status(500).json([]);
    }
  }
}
```

As we can see in the preceding code snippet, the inversify-express-utils allow us to implement routing, dependency injection and even apply some Express.js middleware using a very declarative and developer friendly API. This is the kind of developer experience that we want to enable thanks to InversifyJS.

## Features

Let's take a look to the InversifyJS features!

The core InversifyJS has a rich API and supports many use cases and [features](https://github.com/inversify/InversifyJS/tree/master/wiki#the-inversifyjs-features-and-api) including support for classes, support for Symbols, container API, controlling the scope of the dependencies, injecting a constant or dynamic value, create your own tag decorators, named bindings, circular dependencies

In top of an extensive list of features, we also want to provide developers with a great user experience and we are working on a serie for side-projects to facilitate the integration of InversifyJS with multiple frameworks and to provide developers with a great development experience : inversify-binding-decorators, inversify-inject-decorators, inversify-express-utils, inversify-restify-utils, inversify-vanillajs-helpers, inversify-tracer, inversify-logger-middleware, inversify-devtools.

### Declaring core modules

Kernel modules can help you to manage the complexity of your bindings in very large applications.

```javascript
let someModule: IKernelModule = (kernel: IKernel) => {
    kernel.bind<Warrior>("Warrior").to(Ninja);
    kernel.bind<Weapon>("Weapon").to(Katana);
    kernel.bind<ThrowableWeapon>("ThrowableWeapon").to(Shuriken);
};

let kernel = new Kernel({ modules: [ someModule ] });
```

### Controlling the scope of the dependencies

InversifyJS uses transient scope by default but you can also use singleton scope:

```javascript
kernel.bind<ThrowableWeapon>("ThrowableWeapon").to(Shuriken).inTransientScope(); // Default
kernel.bind<ThrowableWeapon>("ThrowableWeapon").to(Shuriken).inSingletonScope();
```

### Injecting a value

Binds an abstraction to a constant value.

```javascript
kernel.bind<Weapon>("Weapon").toValue(new Katana());
```

### Injecting a class constructor

Binds an abstraction to a class constructor.

```javascript
@inject("Weapon", "ThrowableWeapon")
class Ninja implements Warrior {

    private _katana: Weapon;
    private _shuriken: ThrowableWeapon;

    public constructor(Katana: INewable<Weapon>, shuriken: ThrowableWeapon) {
        this._katana = new Katana();
        this._shuriken = shuriken;
    }

    public fight() { return this._katana.hit(); };
    public sneak() { return this._shuriken.throw(); };

}
```

```javascript
kernel.bind<INewable<Weapon>>("INewable<Weapon>").toConstructor<Weapon>(Katana);
```

### Injecting a FactoryInjecting a Factory

Binds an abstraction to a user defined Factory.

```javascript
@inject("Weapon", "ThrowableWeapon")
class Ninja implements Warrior {

    private _katana: Weapon;
    private _shuriken: ThrowableWeapon;

    public constructor(katanaFactory: IFactory<Weapon>, shuriken: ThrowableWeapon) {
        this._katana = katanaFactory();
        this._shuriken = shuriken;
    }

    public fight() { return this._katana.hit(); };
    public sneak() { return this._shuriken.throw(); };

}
```

```javascript
kernel.bind<IFactory<Weapon>>("IFactory<Weapon>").toFactory<Weapon>((context) => {
    return () => {
        return context.kernel.get<Weapon>("Weapon");
    };
});
```

### Auto factory

Binds an abstraction to a auto-generated Factory.

```javascript
@inject("Weapon", "ThrowableWeapon")
class Ninja implements Warrior {

    private _katana: Weapon;
    private _shuriken: ThrowableWeapon;

    public constructor(katanaFactory: IFactory<Weapon>, shuriken: ThrowableWeapon) {
        this._katana = katanaFactory();
        this._shuriken = shuriken;
    }

    public fight() { return this._katana.hit(); };
    public sneak() { return this._shuriken.throw(); };

}
```

```js
kernel.bind<IFactory<Weapon>>("IFactory<Weapon>").toAutoFactory<Weapon>();
```

### Injecting a Provider (asynchronous Factory)

Binds an abstraction to a Provider. A provider is an asynchronous factory, this is useful when dealing with asynchronous I/O operations.

```js
@inject("Weapon", "ThrowableWeapon")
class Ninja implements Warrior {

    public katana: Weapon;
    public shuriken: ThrowableWeapon;
    public katanaProvider: IProvider<Weapon>;

    public constructor(katanaProvider: IProvider<Weapon>, shuriken: ThrowableWeapon) {
        this.katanaProvider = katanaProvider;
        this.katana= null;
        this.shuriken = shuriken;
    }

    public fight() { return this._katana.hit(); };
    public sneak() { return this._shuriken.throw(); };

}

var ninja = kernel.get<Warrior>("Warrior");

ninja.katanaProvider()
     .then((katana) => { ninja.katana = katana; })
     .catch((e) => { console.log(e); });
```

```js
kernel.bind<IProvider<Weapon>>("IProvider<Weapon>").toProvider<Weapon>((context) => {
    return () => {
        return new Promise<Weapon>((resolve) => {
            let katana = context.kernel.get<Weapon>("Weapon");
            resolve(katana);
        });
    };
});
```

### Injecting a proxy

It is possible to create a [proxy](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Proxy) of a dependency just before it is injected. This is useful to keep our dependencies agnostic of the implementation of crosscutting concerns like caching or logging.

```js
interface Weapon {
    use: () => void;
}

class Katana implements Weapon {
    public use() {
        console.log("Used Katana!");
    }
}

interface Warrior {
    katana: Weapon;
}

@inject("Weapon")
class Ninja implements Warrior {
    public katana: Weapon;
    public constructor(katana: Weapon) {
        this.katana = katana;
    }
}
```

```js
kernel.bind<Warrior>("Warrior").to(Ninja);

kernel.bind<Weapon>("Weapon").to(Katana).proxy((katana) => {
    let handler = {
        apply: function(target, thisArgument, argumentsList) {
            console.log(`Starting: ${new Date().getTime()}`);
            let result = target.apply(thisArgument, argumentsList);
            console.log(`Finished: ${new Date().getTime()}`);
            return result;
        }
    };
    katana.use = new Proxy(katana.use, handler);
    return katana;
});
```

### Multi-injection

We can use multi-injection When two or more concretions have been bound to the an abstraction. Notice how an array of `IWeapon` is injected into the `Ninja` class via its constructor:

```js
interface IWeapon {
    name: string;
}

class Katana implements IWeapon {
    public name = "Katana";
}
class Shuriken implements IWeapon {
    public name = "Shuriken";
}

interface Warrior {
    katana: IWeapon;
    shuriken: IWeapon;
}

@inject("IWeapon[]")
class Ninja implements Warrior {
    public katana: IWeapon;
    public shuriken: IWeapon;
    public constructor(weapons: IWeapon[]) {
        this.katana = weapons[0];
        this.shuriken = weapons[1];
    }
}
```

We are binding `Katana` and `Shuriken` to `IWeapon`:

```js
kernel.bind<Warrior>("Warrior").to(Ninja);
kernel.bind<IWeapon>("IWeapon").to(Katana);
kernel.bind<IWeapon>("IWeapon").to(Shuriken);
```

### Tagged bindings

We can use tagged bindings to fix `AMBIGUOUS_MATCH` errors when two or more concretions have been bound to the an abstraction. Notice how the constructor arguments of the `Ninja` class have been annotated using the `@tagged` decorator:

```js
interface IWeapon {}
class Katana implements IWeapon { }
class Shuriken implements IWeapon {}

interface Warrior {
    katana: IWeapon;
    shuriken: IWeapon;
}

@inject("IWeapon", "IWeapon")
class Ninja implements Warrior {
    public katana: IWeapon;
    public shuriken: IWeapon;
    public constructor(
        @tagged("canThrow", false) katana: IWeapon,
        @tagged("canThrow", true) shuriken: IWeapon
    ) {
        this.katana = katana;
        this.shuriken = shuriken;
    }
}
```

We are binding `Katana` and `Shuriken` to `IWeapon` but a `whenTargetTagged` constraint is added to avoid `AMBIGUOUS_MATCH` errors:

```js
kernel.bind<Warrior>(ninjaId).to(Ninja);
kernel.bind<IWeapon>(weaponId).to(Katana).whenTargetTagged("canThrow", false);
kernel.bind<IWeapon>(weaponId).to(Shuriken).whenTargetTagged("canThrow", true);
```

### Create your own tag decorators

Creating your own decorators is really simple:

```js
let throwable = tagged("canThrow", true);
let notThrowable = tagged("canThrow", false);

@inject("IWeapon", "IWeapon")
class Ninja implements Warrior {
    public katana: IWeapon;
    public shuriken: IWeapon;
    public constructor(
        @notThrowable katana: IWeapon,
        @throwable shuriken: IWeapon
    ) {
        this.katana = katana;
        this.shuriken = shuriken;
    }
}
```

### Named bindings

We can use named bindings to fix `AMBIGUOUS_MATCH` errors when two or more concretions have been bound to the an abstraction. Notice how the constructor arguments of the `Ninja` class have been annotated using the `@named` decorator:

```js
interface IWeapon {}
class Katana implements IWeapon { }
class Shuriken implements IWeapon {}

interface Warrior {
    katana: IWeapon;
    shuriken: IWeapon;
}

@inject("IWeapon", "IWeapon")
class Ninja implements Warrior {
    public katana: IWeapon;
    public shuriken: IWeapon;
    public constructor(
        @named("strong")katana: IWeapon,
        @named("weak") shuriken: IWeapon
    ) {
        this.katana = katana;
        this.shuriken = shuriken;
    }
}
```

We are binding `Katana` and `Shuriken` to `IWeapon` but a `whenTargetNamed` constraint is added to avoid `AMBIGUOUS_MATCH` errors:

```js
kernel.bind<Warrior>("Warrior").to(Ninja);
kernel.bind<IWeapon>("IWeapon").to(Katana).whenTargetNamed("strong");
kernel.bind<IWeapon>("IWeapon").to(Shuriken).whenTargetNamed("weak");
```

### Contextual bindings & `@paramNames`

The `@paramNames` decorator is used to access the names of the constructor arguments from a contextual constraint even when the code is compressed. The `constructor(katana, shuriken) { ...` becomes `constructor(a, b) { ...` after compression but thanks to `@paramNames` we can still refer to the design-time names `katana` and `shuriken`.

```js
interface IWeapon {}
class Katana implements IWeapon { }
class Shuriken implements IWeapon {}

interface Warrior {
    katana: IWeapon;
    shuriken: IWeapon;
}

@inject("IWeapon", "IWeapon")
@paramNames("katana","shuriken")
class Ninja implements Warrior {
    public katana: IWeapon;
    public shuriken: IWeapon;
    public constructor(
        katana: IWeapon,
        shuriken: IWeapon
    ) {
        this.katana = katana;
        this.shuriken = shuriken;
    }
}
```

We are binding `Katana` and `Shuriken` to `IWeapon` but a custom when constraint is added to avoid `AMBIGUOUS_MATCH` errors:

```js
kernel.bind<Warrior>(ninjaId).to(Ninja);

kernel.bind<IWeapon>("IWeapon").to(Katana).when((request: IRequest) => {
    return request.target.name.equals("katana");
});

kernel.bind<IWeapon>("IWeapon").to(Shuriken).when((request: IRequest) => {
    return request.target.name.equals("shuriken");
});
```

The target fields implement the `IQueryableString` interface to help you to create your custom constraints:

```js
interface IQueryableString {
  startsWith(searchString: string): boolean;
  endsWith(searchString: string): boolean;
  contains(searchString: string): boolean;
  equals(compareString: string): boolean;
  value(): string;
}
```

### Circular dependencies

InversifyJS is able to identify circular dependencies and will throw an exception to help you to identify the location of the problem if a circular dependency is detected:

`<code>Error: Circular dependency found between services: Weapon and Warrior</code>`
