const squaresView = /*html*/`
    <div id="container-intro"></div>
    <div id='result-zone'>
        <div id="msg">Invalid move</div>
        <div id="new-arr">New arrangment !</div>
        <!-- <img id="info-btn" src="./images/info.svg" width="30" height="30" alt="Info" title="Info">                  -->
        <img id="spinner" src="./images/spinner.svg" width="50" height="50" alt="spinner" title="spinner">

        <div id="legend">
            <div id="legend-line-0" class="legend-line">
                <div class="line-0"></div>
                <div class="value">0</div>
            </div>
            <div class="legend-line">
                <div class="line-1"></div>
                <div class="value">1</div>
            </div>
            <div class="legend-line">
                <div class="line-2"></div>
                <div class="value">2</div>
            </div>
        </div>

        <div id="current-arr-container">
            <div>Current arrangment:</div>
            <input id="current-arr" type="text" name="current-arr" value='1'>
            <div>/</div>
            <div id="nbArr"></div>
        </div>

        <div id="lock-arr">
            <p>Lock arrangment:</p>
            <div id="switch-on-off">
                <img id="switch-on-btn" src="./images/switch-on.svg" width="30" height="30" alt="Lock arrangment"
                    title="Click to lock and stay in the current arrangment">
                <img id="switch-off-btn" src="./images/switch-off.svg" width="30" height="30" alt="Unlock arrangments"
                    title="Click to unlock and allow to explore new arrangments">
            </div>
        </div>
        <div id="nbr-squares">
            <p>Number of squares:</p>
            <select id="select-nb-squares">
                <option value="2">2</option>
                <option value="3">3</option>   
            </select>
        </div>
        <div id='matrices'></div>
    </div>

    <div id="container-btn-control"></div>

    <div id="container-move-squares"></div>

    <div style="opacity: 0;">Icons made by<a href="https://www.flaticon.com/authors/smashicons"
            title="Smashicons">Smashicons</a> from <a href="https://www.flaticon.com/"
            title="Flaticon">www.flaticon.com</a>
    </div>


    
    <!--<div id="update-json">Update json</div>
    <div id="add-current-arr">Add current arrangment to selection</div>
    <div id="export-selection-arrs">Download selection</div>
    -->
    
`;

export default squaresView;