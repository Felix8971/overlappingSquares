const moveSquaresControlButtons = /*html*/`
    <div class='line' id="translate">
        <p>Translate (pixel)</p>
        <div id="go-up">&uarr;</div>
        <div class="form-group">
            <div id="go-left">&larr;</div>
            <div id="column">
                <div>
                    <input class="step-input" type="text" id="translation-step" name="translation-step" min="1"
                        max="50" value='5'>
                </div>
                <div class="small-btn-container">
                    <div class="small-button" id='decrease-translation-step'>-</div>
                    <div class="small-button" id='increase-translation-step'>+</div>
                </div>
            </div>
            <div id="go-right">&rarr;</div>
        </div>
        <div id="go-down">&darr;</div>
    </div>
    <div>
        <div class='line' id="rotate">
            <p>Rotate (degres)</p>
            <div class="form-group">
                <div class="form-group">
                    <div id="rotate-moins" class='flip'>&#8635;</div>
                    <div class="column">
                        <div>
                            <input class="step-input" type="text" id="rotation-step" name="rotation-step"
                                value='5'>
                        </div>
                        <div class="small-btn-container">
                            <div class="small-button" id='decrease-rotation-step'>-</div>
                            <div class="small-button" id='increase-rotation-step'>+</div>
                        </div>
                    </div>
                    <div id="rotate-plus">&#8635;</div>
                </div>
            </div>
            <div class='line' id="resize">
                <p>Resize (pixel)</p>
                <div class="form-group">
                    <div id="resize-moins">-</div>
                    <div class="column">
                        <div>
                            <input class="step-input" id="resize-step" type="text" name="resize-step" min="1"
                                max="300" value='5'>
                        </div>
                        <div class="small-btn-container">
                            <div class="small-button" id='decrease-resize-step'>-</div>
                            <div class="small-button" id='increase-resize-step'>+</div>
                        </div>
                    </div>
                    <div id="resize-plus">+</div>
                </div>
            </div>
        </div>
    </div>
  
`;

export default moveSquaresControlButtons;