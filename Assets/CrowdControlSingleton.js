//#pragma strict

// This script is meant to be attached to a singleton GameObject.  It
// initializes and tears down the large stress test crowd.

var people : Array;

function Awake() {
    // Initialize the people array.
    people = new Array();
	
    // Fill the people array.
	var num_people = 60;
	for(var i = 0; i < num_people; i++)
	{
		// Create a new cylinder.
		var person : GameObject
			= GameObject.CreatePrimitive(PrimitiveType.Cylinder);
	
		// Adjust the cylinder properties.
		
		// Decide on a position.
		var pos_dist_center = Vector3(0, 0.15, -15);
		var pos_dist_range = Vector3(20, 0, 0.5);
		var uniform_variate = Vector3(Random.value, Random.value, Random.value);
		person.transform.position = Vector3(
			pos_dist_range.x * uniform_variate.x
            + pos_dist_center.x - pos_dist_range.x / 2.0,
			pos_dist_range.y * uniform_variate.y
            + pos_dist_center.y - pos_dist_range.y / 2.0,
			pos_dist_range.z * uniform_variate.z
            + pos_dist_center.z - pos_dist_range.z / 2.0
		);
		
		// Set the scale.
		person.transform.localScale = Vector3(0.3, 0.3, 0.3);
		
		// Assign the PersonMove script to the created person to put it under
        // script control.  The JS engine gives each script its own type.
		person.AddComponent(PersonMove);
		
        // Set the "crowd-member" tag on each person so that the UAVs can find
        // them in the scene hierarchy.
        person.tag = "crowd-member";
        
		// Record the cylinder in the bodies array.
		people.Add(person);
	}
}

function Start () {

    
}

function Update () {
    // Updates of individual people are handled by their controller scripts.
}

function OnDestroy() {

    // Tear down any existing crowd members.
    for(person in people)
    {
        Destroy(person);
    }

}