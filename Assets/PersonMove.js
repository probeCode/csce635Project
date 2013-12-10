
var velocity : Vector3;
var new_velocity : Vector3;

var goBack = false;

//position variables
var bound1 = 0.46;
var bound2 = 1.22;
var bound3 = 3.66;
var sqrLen = 0.0;

var uav_blockers : Array;

function Start()
{
    // Set an initial random velocity towards the line.
    new_velocity = Vector3(
        3 * Random.value - 1.5,
        0,
        3 * Random.value + 0.1
    );
	
	// Find all uavs in the simulation -- all installed uavs are tagged with
    // the "uav-blocker" tag.
	uav_blockers = GameObject.FindGameObjectsWithTag("uav-blocker");  
}
function Update ()
{
    velocity = new_velocity;

    // Find all other people in the simulation -- all installed people have
    // the "crowd-member" tag.  This is not the most efficient way in the world
    // to perform flocking, but whatever.
    var crowd_members = GameObject.FindGameObjectsWithTag("crowd-member");
    
    // Filter crowd members by distance to this crowd member.
    var neighbors = new Array();
    for(candidate in crowd_members)
    {
        var distance
            = (candidate.transform.position - transform.position).magnitude;
    
        if(distance > 0.1 && distance < 10)
        {
            neighbors.Add(candidate);
        }
    }
    
    // Filter the uavs by distance.
    var uav_neighbors = new Array();
    for(candidate in uav_blockers)
    {
        distance
            = (candidate.transform.position - transform.position).magnitude;
            
        if(distance > 0.01 && distance < 7)
        {
            uav_neighbors.Add(candidate);
        }
    }
    
    //
    // Flock over neighbors and uav_neighbors.
    // 
    
    // Perform velocity matching with neighbors.
    var new_speed = 0.0;
    if(neighbors.length > 0)
    {
        for(neighbor in neighbors)
        {
            new_speed = new_speed
                + neighbor.GetComponent(PersonMove).velocity.magnitude;
        }
        
        new_speed = (new_speed / neighbors.length);
        
        // Take the average of our current speed and the new speed suggested by
        // our neighbors.
        new_speed = (new_speed + velocity.magnitude) / 2.0;
    }
    else
    {
        // If no neighbors are in range, take the average of our current speed
        // and a base speed that a calm person would walk at.  The net effect
        // will be to slow the person down to the base speed slowly.  This
        // simulates people calming down as they get out of the crowd.
        new_speed = (velocity.magnitude + 1) / 2.0;
    }
    
    // Peform heading matching with neighbors.
    var new_heading : Vector3 = Vector3(0,0,0);
    if(neighbors.length > 0)
    {
        var neighbor_position = Vector3(0,0,0);
        for(neighbor in neighbors)
        {
            neighbor_position
                += transform.position - neighbor.transform.position;
        
            new_heading = new_heading
                + neighbor.GetComponent(PersonMove).velocity.normalized;
        }
        new_heading = new_heading.normalized;
        neighbor_position = neighbor_position.normalized;
        
        // Take the average between our current heading and the suggested
        // heading.
        new_heading
            = (
                new_heading + 2 * neighbor_position + velocity.normalized
                + 2 * Vector3(0, 0, 1)
            ).normalized;
    }
    else
    {
        // If no neighbors are in range, gradually turn towards the line (+Z).
        var plus_z = Vector3(0, 0, 1);
        new_heading = (velocity.normalized + plus_z).normalized;
    }
    
    // Overall suggestion from the matching component of flocking.
    var match_velocity = new_speed * new_heading;

    
    // Get the new velocity that results from flocking.
    new_velocity = new_speed * new_heading;
    
    // Update our position.
    transform.Translate(Time.deltaTime * velocity);
	
	//stop at back wall
	// if(transform.position.z < 0.9){		// transform.Translate(xMove, 0, zMove);
	// }}
