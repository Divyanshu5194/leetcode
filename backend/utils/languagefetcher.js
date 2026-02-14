async function languageListFetcher(){
  try{
    const res=await fetch("https://ce.judge0.com/languages")
    const languages=await res.json();
    return languages
  }
  catch(error){
    console.log(error)
    process.exit(1)
  }
}

const getIdOfLanguage=(languagearrr,languagetosearchfor)=>{
        const foundLanguage=languagearrr.find(language =>language.name===languagetosearchfor);
        if(!foundLanguage){
            throw new Error("invalid language")
        }
        return foundLanguage.id;
    }

export {languageListFetcher,getIdOfLanguage}