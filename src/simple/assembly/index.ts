import { storage, Context, u128 } from "near-sdk-as"

//import { toYocto } from "../../utils"
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