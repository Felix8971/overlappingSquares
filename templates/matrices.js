
const matrices = /*html*/`
<div class="matrix-body">
    <div class="column-result" id="v-matrix">
        <div class="column-result">V = </div>
        <div class="line-matrix-group">
            <div class="line-matrix">
                <div class="m-square border-left border-top"></div>
                <div id="v00" class="m-square">0</div>
                <div id="v01" class="m-square">0</div>
                <div id="v02" class="m-square">0</div>
                <div class="m-square border-right border-top"></div>
            </div>
            <div class="line-matrix">
                <div class="m-square border-left"></div>
                <div id="v10" class="m-square">0</div>
                <div id="v11" class="m-square">0</div>
                <div id="v12" class="m-square">0</div>
                <div class="m-square border-right"></div>
            </div>
            <div class="line-matrix">
                <div class="m-square border-left border-bottom"></div>
                <div id="v20" class="m-square">0</div>
                <div id="v21" class="m-square">0</div>
                <div id="v22" class="m-square">0</div>
                <div class="m-square border-right border-bottom"></div>
            </div>
        </div>
        <div id="v-illegal">illegal!</div>
    </div>

    <div class="column-result" id="f-matrix">
        <div class="column-result">F = </div>
        <div class="line-matrix-group">
            <div class="line-matrix">
                <div class="m-square border-left border-top"></div>
                <div id="f00" class="m-square">0</div>
                <div id="f01" class="m-square">0</div>
                <div id="f02" class="m-square">0</div>
                <div class="m-square border-right border-top"></div>
            </div>
            <div class="line-matrix">
                <div class="m-square border-left"></div>
                <div id="f10" class="m-square">0</div>
                <div id="f11" class="m-square">0</div>
                <div id="f12" class="m-square">0</div>
                <div class="m-square border-right"></div>
            </div>
            <div class="line-matrix">
                <div class="m-square border-left"></div>
                <div id="f20" class="m-square">0</div>
                <div id="f21" class="m-square">0</div>
                <div id="f22" class="m-square">0</div>
                <div class="m-square border-right"></div>
            </div>
            <div class="line-matrix">
                <div class="m-square border-left border-bottom"></div>
                <div id="f30" class="m-square">0</div>
                <div id="f31" class="m-square">0</div>
                <div id="f32" class="m-square">0</div>
                <div class="m-square border-right border-bottom"></div>
            </div>
        </div>
        <div id="f-illegal">illegal!</div>
    </div>
</div>
`;

export default matrices;