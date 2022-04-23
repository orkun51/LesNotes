//assembly/model.ts
import {
  PersistentUnorderedMap,math,Context,
  u128,ContractPromiseBatch} from "near-sdk-as"
import { getNotes } from ".";

import { AccountId,Money,} from "../../utils"

export const notes=new PersistentUnorderedMap<u32, Notes>("notes"); 
export const noteOwners=new PersistentUnorderedMap<u32, Array <AccountId>>("access");
export const lessonclasses=new PersistentUnorderedMap<u32, LessonClasses>("lessonclasses");
export const supeducators=new PersistentUnorderedMap<u32, Supeducator>("supeducators");

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


