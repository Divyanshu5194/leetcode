import { useSelector } from "react-redux"

export default function LanguageSelectorFeild({language,setLanguage}){
    const {languageArray}=useSelector((state)=>state.auth)
    return (
        <div>
            <select
                className="select select-bordered w-full max-w-xs" value={language} onChange={(e) => setLanguage(e.target.value)}>
                    {
                        languageArray.map((language)=><option key={language.id}>{language.name}</option>)
                    }
            </select>
        </div>
    )
}