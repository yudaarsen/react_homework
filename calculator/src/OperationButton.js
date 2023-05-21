import { ACTIONS } from "./Calculator";


export default function OperationButton({operation, dispatch, cl}) {
    return (
        <button className={cl} onClick={()  => dispatch({type: ACTIONS.CHOOSE_OPERATION, payload: { opcode: operation }})}>{operation}</button>
    );
}
 
