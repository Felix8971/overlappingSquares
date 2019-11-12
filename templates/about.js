const about = /*html*/`
    <p>This web site is concerned with a problem in combinatorial geometry.
            Roughly speaking, I’m interested in the number of ways in which N squares can overlap.</p>
        
            <p>You can find a full description 
                <a style="color: lime;" href="https://medium.com/@flixdebon/in-how-many-ways-can-squares-overlap-eea4b807c1a7">here</a>
            </p>
            <p>Rules of construction:</p>
        <ul>
            <li>Two arrangements of squares are considered the same if one can be continuously changed to the other
                without any vertex passing through an edge.</li>
            <li>The squares can be rescaled, rotated and translated but they must keep their square shape and be
                contained in a finite space. They cannot be reduced to a point.</li>
            <li>A vertex cannot be superimposed with an edge or with another vertex. </li>
            <li>Turning the whole configuration over is allowed (mirror image) and doesn’t change the arrangement.</li>
            <li>The squares are drawn in an affine plane.</li>
        </ul>

        <img id="example-1" src="./images/example1.png" alt="example" title="example">
        <p style="color:rgb(138, 138, 238);font-style: oblique;">Example. (a) and (b) represent the same arrangement
            because we can pass from (a) to (b) by translating and rotating the squares. However (b) and (c) are
            different because we cannot pass from (b) to (c) by a continuous transformation, a mirror image or by a
            composition of these transformations.</p>

        <p>Understanding of how geometric objects can be represented algebraically is crucial in the resolution of this
            problem. I developed a method to extract "the essence" of each square’s arrangement in the form of 3 arrays
            of integers.
            This page present the arrangements I found (until N=4) based on this approach coupled with a brute force
            algorithm.</p>

        <p>Initially I built this tool to help me in the resolution of this problem and then I thought it would be
            interesting to share it with the rest of the world.
            This tool was also extremely useful to test the validity of my code (not to say essential)</p>

        <p><strong>How this project was born ?</strong> I was looking for a problem where I can use a computer to do a
            bit of experimental
            mathematics. This overlapping square problem appeared to be interesting to me because
            it didn’t seem to require knowledge in math higher than analytic geometry (for the brute force algorithm part).
            Moreover, as far as I know, it is also an unexplored territory...</p>
            
            
`;

export default about;