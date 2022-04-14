import "./Cell.css";
import React from 'react'


interface Props {
    handleCellClick: any
    id: any
    text: any
  }

const Cell: React.FC<Props> = ({ handleCellClick, id, text}) => 
   (
    <div id={id} className="cell" onClick={handleCellClick} onKeyDown={handleCellClick} aria-hidden="true">
      {text}
    </div>
  );

// export default Cell;



// function Cell( handleCellClick: any, id: any, text: any): JSX.Element {
//     return (
//         <div role="cell-slot" id={id} className="cell" onClick={handleCellClick} onKeyDown={handleCellClick}>
//       {text}
//     </div>
//     )
// }

export default Cell
