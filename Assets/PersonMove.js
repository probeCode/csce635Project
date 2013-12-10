
var velocity : Vector3;

var new_position : Vector3;
var new_velocity : Vector3;

function Start()
{
    // Set an initial random velocity towards the line.
    new_velocity = Vector3(
        3 * Random.value - 1.5,
        0,
        3 * Random.value + 0.1
    );
	
	new_position = transform.position;
}
function Update ()
{
    // Copy the velocity calculated on the last timestep to the hold variable.
    // This lets us be sure that for the calculations that follow, all people
    // see a consistent view of the world.
    velocity = new_velocity;
    transform.position = new_position;

    // Find all other people in the simulation -- all installed people have
    // the "crowd-member" tag.  This is not the most efficient way in the world
    // to perform flocking, but whatever.
    var crowd_members = GameObject.FindGameObjectsWithTag("crowd-member");
    
    // Find all uavs in the simulation -- all installed uavs are tagged with
    // the "uav-blocker" tag.
	var uav_blockers = GameObject.FindGameObjectsWithTag("uav-blocker");
    
    // Filter crowd members by distance to this crowd member.
    var neighbors = new Array();
    for(candidate in crowd_members)
    {
        var distance
            = (candidate.transform.position - transform.position).magnitude;
    
        if(distance > 0.1 && distance < 3)
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
            
        if(distance > 0.0001 && distance < 15)
        {
            uav_neighbors.Add(candidate);
        }
    }
    
    //
    // Flock over neighbors and uav_neighbors.  The new velocity of each person
    // is composed of several sub-behaviors with tunable gains.  There is
    // repulsion from neighbors and attraction to the neighbor barycenter,
    // velocity matching with neighbors, repulsion from UAVs, repulsion from
    // walls, attraction to the exit direction, and the current velocity.
    //
    
    // Aggregate repulsion from neighbors.
    var nr_force = Vector3(0,0,0);
    if(neighbors.length > 0)
    {
        for(neighbor in neighbors)
        {
            var nr_offset = transform.position - neighbor.transform.position;
            var nr_distance = nr_offset.magnitude;    
                
            // Cap distance to prevent blowing up at the pole of the repulsion
            // function.
            if(nr_distance > 0.01)
            {
                nr_force = nr_force + -1.0 * nr_offset.normalized / nr_distance;
            }
        }            
    }
    
    // Calculate force towards neighborhood barycenter.
    var nb_force = Vector3(0,0,0);
    if(neighbors.length > 0)
    {
        var nb_accum = Vector3(0,0,0);
        for(neighbor in neighbors)
        {
            nb_accum = nb_accum
                + (neighbor.transform.position - transform.position);
        }
        nb_force = nb_accum / neighbors.length;
    }
    
    // Aggregate velocity matching with neighbors.
    var vm_force = Vector3(0,0,0);
    if(neighbors.length > 0)
    {
        var vm_accum = Vector3(0,0,0);
        for(neighbor in neighbors)
        {
            vm_accum = vm_accum + neighbor.GetComponent(PersonMove).velocity;
        }
        vm_force = vm_accum / neighbors.length;
    }
    
    // Aggregate repulsive forces from UAVS.
    var ur_force = Vector3(0,0,0);
    if(uav_neighbors.length > 0)
    {
        for(neighbor in uav_neighbors)
        {
            var ur_offset = (transform.position - neighbor.transform.position);
            
            // Remove the x and y component of offset.
            //ur_offset.x = 0;
            ur_offset.y = 0;
            
            var ur_distance = ur_offset.magnitude;
            
            if(ur_distance > 0.001)
            {
                ur_force
                    = ur_force + ur_offset.normalized / ur_distance;
            }
        }
    }
    
    // Constant force towards the exit point.
    var exit_point = Vector3(0, 0, 5);
    var ep_force = (exit_point - transform.position).normalized;
    
    // Overall force experienced is a linear combination of the above terms.
    var nr_gain = 1.0;
    var nb_gain = 0.5;
    var vm_gain = 0.7;
    var ur_gain = 5;
    var ep_gain = 1.0;
    var total_force = nr_gain * nr_force
        + nb_gain * nb_force
        + vm_gain * vm_force
        + ur_gain * ur_force
        + ep_gain * ep_force;
        
    // Project the acceleration to the xz plane, to keep the uav components from
    // pushing people up or down.
    total_force = total_force - Vector3.Project(total_force, Vector3(0, 1, 0));
    
    // Compute acceleration from the summed force.
    var total_acceleration = total_force / 1.0;
        
    // Set new velocity and new position
    new_velocity = new_velocity + Time.deltaTime * total_acceleration;
    new_position = new_position + velocity * Time.deltaTime;
    
    // Cap new velocity.
    if(new_velocity.magnitude > 5.0)
    {
        new_velocity = 5.0 * new_velocity.normalized;
    }
    
    // Clip to walls.
    if(new_position.x > 8)
    {
        new_position.x = 8;
        
        if(new_velocity.x > 0)
        {
            new_velocity.x = -0.5 * new_velocity.x;
        }
    }
    else if(new_position.x < -8)
    {
        new_position.x = -8;
        
        if(new_velocity.x < 0)
        {
            new_velocity.x = -0.5 * new_velocity.x;
        }
    }
    
    if(new_position.z > 1.5)
    {
        new_position.z = 1.5;
        
        if(new_velocity.z > 0)
        {
            new_velocity.z = -0.5 * new_velocity.z;
        }
    }
    else if(new_position.z < -14)
    {
        new_position.z = -14;
        
        if(new_velocity.z < 0)
        {
            new_velocity.z = -0.5 * new_velocity.z;
        }
    }}
