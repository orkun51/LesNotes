# `Les Notes` 

This is a project for students. This project includes two different parts. First part; in Universites or Schools students have study notes and sometimes,they don't want to share their notes for free. In this project, students can buy a lesson notes. So, they can build their lesson notes and sell them.(Maybe they can create NFT from their lesson notes. The project can develop on this idea). Second part is like chairity system but it is for students and lessons. Students can create a Lesson Classes and Supeducators(Supporter of education) can donate this classes.In the future; students can work together in this classes and they can write lesson notes for others. Students create a NFT from lesson notes in this classes. And supeducators can help students. 
This project I prepared as part of the NEAR Developer Course program offered by Patika.dev & NEAR Protocol. 

My project was selected as one of the 100 best projects of all time by Near University.
---

www.patika.dev

### Getting started

INSTALL `NEAR CLI` first like this: `npm i -g near-cli`

1. git clone this repo  https://github.com/orkun51/LesNotes
2. yarn
3. near login, and login to your testnet account.
4. yarn build:release
6. near dev-deploy ./build/release/simple.wasm
7. export CONTRACT =<dev-....>

Also;

1.sh ./scripts/1.dev-deploy.sh

2.sh ./scripts/2.use-contract.sh

3.sh ./scripts/3.cleanup.sh


  For create a Note 
```
near call $CONTRACT createNote '{"name": "Note Name", "Lesson": "Genres", "price" : 5}' --accountId orkun.testnet
```
  For buy a Note
```
near call $CONTRACT BuyNote {"id": "Note id"}' --accountId orkun.testnet --deposit 5
```
  For create a Lesson Class
```
near call $CONTRACT openClass '{ "description":"desc", "maxAmount":5}' --accountId orkun.testnet
```
  For close a Lesson Class
```
near call $CONTRACT closeClass '{"id":"Class id"}' --accountId orkun.testnet
```
  For latest schoolarship
```
near view $CONTRACT latestSchoolarship '{"start": 0, "limit": 10}'
```


## Samples

This repository includes a improving project structure for AssemblyScript contracts targeting the NEAR platform.

There is 1 AssemblyScript contracts in this project:

- **simple** in the `src/simple` folder

### Simple

We say that an AssemblyScript contract is written in the "simple style" when the `index.ts` file (the contract entry point) includes a series of exported functions.

-**index.ts** in this folder. You can see the function and you can improve this folder.
-**model.ts** in this folder. You can see the behind the functions in the "index.ts".Also you can improve this folder

In this case, all exported functions become public contract methods.

## Les Notes

# Assembly Directory
In this folder, there are smart contract codes developed by the project using assemblyscript and the near-sdk package provided by Near protocol.

# Model.ts
In this folder, we can see model classes of the 'Les Notes' such as Notes,Lesson Classes and Supeducators.
```
import {
  PersistentUnorderedMap,math,Context,
  u128,ContractPromiseBatch} from "near-sdk-as"
import { getNotes } from ".";

import { AccountId,Money,} from "../../utils"

export const notes=new PersistentUnorderedMap<u32, Notes>("notes"); 
export const noteOwners=new PersistentUnorderedMap<u32, Array <AccountId>>("access");
export const lessonclasses=new PersistentUnorderedMap<u32, LessonClasses>("lessonclasses");
export const supeducators=new PersistentUnorderedMap<u32, Supeducator>("supeducators"); 
```

**Notes Class**
```
//This class for Notes
@nearBindgen
export class Notes 
{
  id: u32
  owner: AccountId=Context.sender
  name:string
  lesson:string
  genres:string
  price: Money
  //comments:PersistentVector<Comment>=new PersistentVector<Comment>("comments")

  constructor(owner: AccountId,name: string,lesson:string,genres:string,price:Money) {
    this.id=math.hash32<string>(name);
    this.owner=owner;  
    this.name=name;
    this.lesson=lesson;
    this.genres=genres;
    this.price=price;
  }

 
  static createNote(owner:AccountId,name:string,lesson:string,genres:string,price:Money): Notes {
    this.assert_note(name);
    const notes=new Notes(owner,name,lesson,genres,price);
    //notes.set(notes.id,notes)
    noteOwners.set(notes.id, new Array <string>());
    return notes;

  }

  static BuyNote(id: u32): void {
    this.assert_price(id)
    let list:Array<AccountId>
    if (noteOwners.contains(id)) 
    {
      list=noteOwners.getSome(id);
      list.push(Context.sender);
      noteOwners.set(id,list);
    }else
    {
      let list=new Array <AccountId>();
      list.push(Context.sender);
      noteOwners.set(id,list);
    }

  }


  static assert_note(name:string): void {
    assert(!notes.contains(math.hash32<string>(name)),"You cannot take this name. Please take another one")
  }
  static assert_price(id:u32):void {
    let notes=this.findNotebyId(id);
    assert(notes.price<=Context.attachedDeposit,"Money is not enough")
  }
  static findNotebyId(id:u32):Notes{
    return notes.getSome(id);
  }
  static findNote(offset:u32,limit:u32=10):Notes[]{
    return notes.values(offset,limit + offset);
  }

}
```
**LessonClasses Class**
```
//This is the class for schoolership. 
@nearBindgen
export class LessonClasses{
  id:u32;//Id of Class
  owner:string=Context.sender;
  description:string;
  amount:u128;
  maxAmount:u128;
  latestSchoolarship:Supeducator;
  complete:bool;

  constructor(owner:string,description:string,maxAmount:u128){
    this.id=math.hash32<string>(owner);
    this.owner=owner;
    this.description=description;
    this.maxAmount= maxAmount;
    this.amount=new u128(0);
    this.complete=true;
 }
 
 static openClass(owner:string,description:string,maxAmount:u128):LessonClasses{
   this.assert_owner_class(math.hash32<string>(owner));
   const lessonClasses=new LessonClasses(owner,description,maxAmount);
   
   lessonclasses.set(lessonClasses.id,lessonClasses);

   return lessonClasses;
 }

 static addAmount(id:u32,message:string,amount:u128):LessonClasses{
   const lessonClasses=this.findLessonclassesbyId(id);
   lessonClasses.amount=u128.add(lessonClasses.amount,amount);
   const supeducators=new Supeducator(id,message,amount);
   lessonClasses.latestSchoolarship=supeducators;

   lessonclasses.set(id,lessonClasses);
   //supeducators.set (supeducators.lenght +1, supeducators);

   return lessonClasses;
 }
 
 static closeClass(lessonClasses:LessonClasses,caller:string): LessonClasses{
   this.assert_owner(lessonClasses,caller);

   const owner_call=ContractPromiseBatch.create(caller);
   owner_call.transfer(lessonClasses.amount);

   lessonClasses.amount =new u128(0);
   lessonClasses.complete=false;

   lessonclasses.set(lessonClasses.id,lessonClasses);

   return lessonClasses;
 }
 
  
 static findLessonclassesbyId(id:u32):LessonClasses{
   return lessonclasses.getSome(id);
 }

 static findLessonclasses(offset:u32,limit:u32=10):LessonClasses[] {
   return lessonclasses.values(offset,limit+offset);
 }
 
 static assert_owner_class(id:u32):void{
   const lessonclass=this.findLessonclassesbyId(id);
   if(lessonclass.complete !=false) 
    {
     assert(!lessonclasses.contains(id),"Owner has another class");
    }
 }
 
 static assert_owner(lessonClasses:LessonClasses, caller:string): void {
   assert(lessonClasses.owner==caller,"Only leader of class can call this function");
 }


}
```
**Supeducators Class**
```
@nearBindgen
export class Supeducator
{
  message:string;
  sup:u128;
  ClassId:u32;

  constructor(ClassId:u32,message:string,sup:u128){
    this.ClassId=ClassId;
    this.message=message;
    this.sup=sup;
  }
  static showLatestSups(offset:u32,limit:u32=20): Supeducator[]{
    return supeducators.values(offset,limit+offset)
  }

}
```
# Index.ts

This folder includes functions.

```
import { storage, Context, u128 } from "near-sdk-as"


import { LessonClasses, Notes, Supeducator } from "./model"

//This function ensure the creating lesson notes
export function createNote(name:string,lesson:string,genres:string,price:u128): Notes {
  return Notes.createNote(Context.sender,name,lesson,genres,price);
}

//This function ensure the buying lesson notes
export function BuyNote(id:u32):void {
  Notes.BuyNote(id);
}

export function getNotes(id:u32): Notes[] {
  return Notes.findNote(id);
}
//get LessonClasses by Id
export function getLessonClassesbyId(id:u32): LessonClasses{
  return LessonClasses.findLessonclassesbyId(id);
}
//This function ensure the opening class
export function openClass (description:string,maxAmount:u128):LessonClasses{
  return LessonClasses.openClass(Context.sender,description,maxAmount);
}

//This function ensures that Supeducators can give schoolarship to classes
export function SupportLessonClasses(id:u32,message:string): LessonClasses{
  return LessonClasses.addAmount(id,message,Context.attachedDeposit);
}
//This function ensures that close the Lesson Classes
export function closeClass(id:u32): LessonClasses{
  return LessonClasses.closeClass(getLessonClassesbyId(id),Context.sender);
}

//Looking for last donations
export function latestSchoolarship(start:u32,limit:u32): Supeducator[] {
  return Supeducator.showLatestSups(start,limit);
}
```











