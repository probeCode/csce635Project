//speed variables
var speed = 0.5;

//movement variables
var startPos = Vector3.zero;
var trans = 0.0;
var xMove = 0.0;
var zMove = 0.0;

//target variables
var target : Transform;
var goBack = false;

//position variables
var bound1 = 0.46;
var bound2 = 1.22;
var bound3 = 3.66;
var sqrLen = 0.0;

var uav_blockers : Array;

function Start()
{
//	random returns a float f such that 0 <= f <= 1
	var rand = Random.value;
//	movement in x direction
//	transform into a value between -.5 and .5 (+/- 45 degrees)
	trans = rand - 0.5;

//	determine random speed (at least 0.3 so it's not completely tedious)
	rand = Random.value;
	speed = rand + 0.3;

	//determine random starting position within bounding box
//	 -2 < x < 2
//	 -11 < z < -10
	rand = Random.value;
	var startX = 15*rand - 7.5;
	rand = Random.value;
	var startZ = -4*rand - 12;
	startPos = new Vector3(startX, 0.33, startZ);
	transform.position = startPos;
	
	// Find each uav in the simulation and add them to the blocker list.
	uav_blockers = new Array();
	uav_blockers.Add(GameObject.Find("/airrobotJ_2-1"));
	uav_blockers.Add(GameObject.Find("/airrobotJ_2-2"));
	uav_blockers.Add(GameObject.Find("/airrobotJ_2-3"));
}
function Update () {
	//determines tilt-ness	xMove = trans * Time.deltaTime * speed;
	//move forward in z direction	zMove = 1.0 * Time.deltaTime * speed;
	var pos = 100;
	
	//determine distance between me and closest robot
	
	for (var uav_blocker in uav_blockers)
	{
		sqrLen = (uav_blocker.transform.position - transform.position).sqrMagnitude;
	
		if(sqrLen < pos)
		{
			pos = sqrLen;
			target = uav_blocker.transform;
		}	
	}
	
	sqrLen = pos;
	
	if( sqrLen < bound3 && !goBack){
		zMove += -.125 * Time.deltaTime * speed;
	}
	if( sqrLen < bound2 && !goBack){
		zMove += -.25 * Time.deltaTime * speed;
	}
	if( sqrLen < bound3 || goBack){
		//too scared = leave
		xMove = 0.0;
		zMove = -0.5 * Time.deltaTime * speed;
		
		//stop at back wall
		if(transform.position.z >= -14){			transform.Translate(xMove, 0, zMove);
		}
		
		goBack = true;
	}
	
	//stop at back wall
	if(transform.position.z < 0.9){		transform.Translate(xMove, 0, zMove);
	}}
