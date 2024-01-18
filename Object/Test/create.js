const myPrototype = {
    sayHello: function() {
        $.writeln('Hello!');
    }
};

const myProperties = {
    name: 'John',
    age: 30,
    occupation: 'Software Developer',
    hobbies: ['Reading', 'Hiking', 'Coding']
};

const myObject = Object.create(myPrototype, myProperties);

myObject.sayHello(); // logs 'Hello!'
$.writeln(myObject.name); // logs 'John'
$.writeln(myObject.age); // logs 30
$.writeln(myObject.occupation); // logs 'Software Developer'
$.writeln(myObject.hobbies); // logs ['Reading', 'Hiking', 'Coding']