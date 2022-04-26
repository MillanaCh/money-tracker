import { createContext } from "react";

export const MoneyTransfer = createContext() 

const MoneyProvider = ({children}) => {
    const data = {}
    return(
        <MoneyTransfer.Provider value={data}>
            {children}
        </MoneyTransfer.Provider>
    )
}
export default MoneyProvider