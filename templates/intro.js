const intro = /*html*/`
    
    <div id="intro">
        This web site is concerned with a problem in combinatorial geometry in the plane.
        Roughly speaking, I’m interested in the number of ways in which N squares can overlap.
        <div id="readMoreLessBtn">Read more...</div>
    </div>

    <div id="more">
        I present below some of the possible arrangments found for 2 or 3 overlapping squares.
        Two arrangements of squares are considered the same if one can be continuously changed to the other without
        any vertex passing through an edge.<br><br>
        V(i,j) = number of vertices from the square i included in the square j<br><br>
        F(i,j) = number intersections found on the segment j of square i<br><br>
        <a id="more-info" href="#">More info here...</a>
    </div>
`;

export default intro;