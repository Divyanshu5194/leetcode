import { languageListFetcher } from "./utils/languagefetcher.js";

(async ()=>{
    const languages=await languageListFetcher()

    const getIdOfLanguage=(language)=>{
        const foundLanguage=languages.find(element =>element.name===language);
        console.log({foundLanguage})
        if(!foundLanguage){
            throw new Error("invalid language")
        }
        return foundLanguage.id;
    }

    console.log(getIdOfLanguage("Clojure (1.10.1)"))
})()