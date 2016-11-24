import React from "react";

export default () => {
    return (
        <div className="modal fade" id="brownOutModal" tabindex="-1" role="dialog" aria-labelledby="myModalLabel">
            <div className="modal-dialog" role="document">
                <div className="modal-content">
                    <div className="modal-header">
                        <h1>Browned Out! Waiting for reset...</h1>
                    </div>
                    <div className="modal-body">
                        <div className="progress progress-striped active">
                            <div className="progress-bar progress-bar" style={{"width": "100%"}}></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};