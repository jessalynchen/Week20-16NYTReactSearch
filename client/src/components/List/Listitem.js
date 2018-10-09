import React from "react";

export const Listitem = props => (
    <li className="list-group-item m-3">
        <div>
            <a className="mb-2 h5" target="_blank" href={props.url}>{props.title}</a>
            <p className="mt-2">Date of Publication: {props.date}</p>
            {props.savedDate ? <p className="mt-2">Saved Date: {props.savedDate}</p> : "" }
            {props.children}
        </div>
    </li>
);