// Vechicle Selection
var arNum : int;
var leftObj : GameObject;
var rightObj : GameObject;


//guard line definition
var ZUpperBound = -5.4;
var ZLowerBound = -5.6;
var YUpperBound = 1.5;
var YLowerBound = 0.5;

//animation variables
var spin : AnimationState;
//audio Variables
var goAway : AudioClip;
var stayBack : AudioClip;
var ambient : AudioClip;

//target variables
var currentTarget : Transform;
//var builtin : Transform[];
var bodies : Array;
var targets : Array;
var numBodies = 3.0;

// UAV variables
var xIS;
var yIS;
var zIS;
var leftDist;
var rightDist;

//proximity variables
var ignore = 5;
var bound1 = 5;
var bound2 = 2;
var guardLine = ZUpperBound;
var stopThreshold = ZUpperBound-.1;

//state
var state = "watching";
var dist = 0.0;
var targetpos = 0.0;

//Reporting Stuff
var outString;
var sText;
var textObject : GameObject;
sText = textObject.GetComponent(GUIText);
outString = "State: " + state.ToString();
sText.text = outString.ToString();

//rotation variables
var rotation = Vector3.zero;
var xRotation = 0.0;
var zRotation = 0.0;
var maxTilt = 15.0;

//movement variables
var movement = Vector3.zero;
var moveSpeed = 2.0;
var sideBound = 1.0;
var followDistance = 0.6;
var keepAliveSpeed = .01;
var goingup = false;
var vertVar = 1;

//define animation behaviors
function Start() {
	
	// If there are any objects recorded in the bodies array, destroy them.
	// I'm not entirely sure that this is necessary.
	for(body in bodies)
	{
		Destroy(body);
	}
	
	// (Re)initialize the bodies array.
	bodies = new Array();
	
	var num_people = 30;
	for(var i = 0; i < num_people; i++)
	{
		// Create a new cylinder.
		var person : GameObject
			= GameObject.CreatePrimitive(PrimitiveType.Cylinder);
	
		// Adjust the cylinder properties.
		
		// Decide on a position.
		var pos_dist_center = Vector3(0, 0.15, -19);
		var pos_dist_range = Vector3(20, 0, 0.5);
		var uniform_variate = Vector3(Random.value, Random.value, Random.value);
		person.transform.position = Vector3(
			pos_dist_range.x * uniform_variate.x + pos_dist_center.x - pos_dist_range.x / 2.0,
			pos_dist_range.y * uniform_variate.y + pos_dist_center.y - pos_dist_range.y / 2.0,
			pos_dist_range.z * uniform_variate.z + pos_dist_center.z - pos_dist_range.z / 2.0
		);
		
		// Set the scale.
		person.transform.localScale = Vector3(0.3, 0.3, 0.3);
		
		// Assign the PersonMove script to the created person to put it under script control.
		// The JS engine gives each script its own type.
		person.AddComponent(PersonMove);
		
		// Record the cylinder in the bodies array.
		bodies.Add(person);
	}
	
	// Clone the bodies array into the targets array.
	targets = new Array(bodies);
	
	spin = animation["Spin"];
	spin.layer = 1;
	spin.blendMode = AnimationBlendMode.Additive;
	spin.wrapMode = WrapMode.Loop;
	spin.speed = 2.0;
	
	targetsAboveLine = new Array ();
	currentTarget = targets[0].transform;
	
	dist = guardLine - currentTarget.transform.position.z;
}

function Update () {
	
	//	Perceptual Schema Calls
	
	findSelf();
	
	findBounds();
	
	findCrowd();
	
	//	Subsumption Coordination Function
	if(currentTarget == null){
		state = "watching";
		targetpos = 0.0;	
	}else{

		state = "watching";
		if(targetpos < bound1){
			state = "approaching";
		}
		if(targetpos < bound2){
			state = "threatening";
		}
	}
	 
	// Motor Schema Calls
	if(state == "approaching"){
		audio.clip = goAway;
		maxTilt = 5; //const
		moveSpeed = 3;
		followDistance = 0.3*Mathf.Abs((.1)/(bound2-bound1) * dist);
		YUpperBound = 0.9;
		YLowerBound = 0.8;
		follow();
	}else if(state == "threatening"){
		audio.clip = stayBack;
		maxTilt = 10.0; //const
		moveSpeed = 4.0; //const
		followDistance = 0.1; //const
		YUpperBound = 1.0;
		YLowerBound = 0.5;
		block();
	}else{
		audio.clip = ambient;
		maxTilt = 3;
		moveSpeed = 1; //const
		followDistance = 0.3; //const
		YUpperBound = 1.0;
		YLowerBound = 0.9;
		hover();
	}

	// Unity Engine Stuff
	// Text Outpt
	outString = "State " + arNum.ToString() + ": " + state.ToString() + "\nDistance: " + targetpos.ToString();
	sText.text = outString.ToString();
	// Audio
	if(audio.isPlaying){	
	}else{
	audio.Play();
	}
	// Flight Bobbing Animation 
	keepAliveSpeed = .001; //const
	keepAlive();
}



// Determines how many bodies are there and selects the one closest to the door
function findCrowd(){
		targets = bodies;
		if(targets.length > 0){
		var closest = targets[0].transform;
		var pos = 100;
		var curPos = 0; 
		//determine closest z-value
		for (var body in targets)
		{
			curPos = Mathf.Sqrt(Mathf.Pow(body.transform.position.x-xIS,2) + Mathf.Pow(body.transform.position.y-yIS,2) + Mathf.Pow(body.transform.position.z-zIS,2));
			if(curPos < pos)
			{
				closest = body.transform;
				pos = curPos;
			}
		}
		
		currentTarget = closest;
	
		targetpos = Mathf.Sqrt(Mathf.Pow(currentTarget.transform.position.x-xIS,2) + Mathf.Pow(currentTarget.transform.position.y-yIS,2) + Mathf.Pow(currentTarget.transform.position.z-zIS,2));
		
	}

}

// Locates the UAV (Would be replaced with the Hokuyo)
function findSelf(){
	xIS = transform.position.x;
	yIS = transform.position.y;
	zIS = transform.position.z;

}

// Locates obsticles near the UAV (Would be replaced with an onboard Hokuyo or something)
function findBounds(){
	leftDist = xIS - leftObj.transform.position.x;
    rightDist = xIS - rightObj.transform.position.x;
}


function hover() {
	
	var diffx = -rightDist + -leftDist;
	
	var tiltAroundZ = Input.GetAxis("Horizontal");
	
	//keep from tipping over
	if(zRotation > maxTilt)
	{
		zRotation = maxTilt;
	}
	if(zRotation < -maxTilt)
	{
		zRotation = -maxTilt;
	}
	//keep within follow distance (x)
	if(diffx < -followDistance)
	{
		movement.x = Time.deltaTime * -moveSpeed;
		zRotation -= 1;
	}
	else if(diffx > followDistance)
	{
		movement.x = Time.deltaTime * moveSpeed;
		zRotation += 1;
	}
	else 
	{
		tiltAroundZ = Input.GetAxis("Horizontal");
		movement.x = 0.0;
	}
	
	transform.Translate(movement.x, 0, 0, currentTarget.transform);
	transform.eulerAngles = Vector3(0, 0, -zRotation);
	
	if(movement.x == 0.0)
	{
		transform.eulerAngles = Vector3(0, 0, 0);
	}
	
}


//follow target in x and z directions
function follow() {
	var tx = currentTarget.position.x;
	
	var diffx = tx - xIS;
	
	var tiltAroundZ = Input.GetAxis("Horizontal");
	
	//keep from tipping over
	if(zRotation > maxTilt)
	{
		zRotation = maxTilt;
	}
	if(zRotation < -maxTilt)
	{
		zRotation = -maxTilt;
	}
	
	//keep within follow distance (x)
	if(diffx < -followDistance)
	{
		movement.x = Time.deltaTime * -moveSpeed;
		zRotation -= 1;
	}
	else if(diffx > followDistance)
	{
		movement.x = Time.deltaTime * moveSpeed;
		zRotation += 1;
	}
	else 
	{
		tiltAroundZ = Input.GetAxis("Horizontal");
		movement.x = 0.0;
	}
	
	if(Mathf.Abs(movement.x+leftDist)<sideBound){
		movement.x = 0.0;
	}
	if(Mathf.Abs(movement.x+rightDist)<sideBound){
		movement.x = 0.0;
	}	
	
	transform.Translate(movement.x, 0, 0, currentTarget.transform);
	transform.eulerAngles = Vector3(0, 0, -zRotation);
	
	if(movement.x == 0.0)
	{
		transform.eulerAngles = Vector3(0, 0, 0);
	}
}


//follow only in x direction
function block(){
	var tx = currentTarget.position.x;

	var diffx = tx - xIS;
	
	var tiltAroundZ = Input.GetAxis("Horizontal");
	
	//keep from tipping over
	if(zRotation > maxTilt)
	{
		zRotation = maxTilt;
	}
	if(zRotation < -maxTilt)
	{
		zRotation = -maxTilt;
	}
	
	
	//keep within follow distance (x)
	if(diffx < -followDistance)
	{
		movement.x = Time.deltaTime * -moveSpeed;
		zRotation += 1;
	}
	else if(diffx > followDistance)
	{
		movement.x = Time.deltaTime * moveSpeed;
		zRotation -= 1;
	}
	else 
	{
		tiltAroundZ = Input.GetAxis("Horizontal");
		movement.x = 0.0;
	}
	
	if(Mathf.Abs(movement.x+leftDist)<sideBound){
		movement.x = 0.0;
	}
	if(Mathf.Abs(movement.x+rightDist)<sideBound){
		movement.x = 0.0;
	}
	
	//keep x value, but rotate forward
	if(xRotation > -maxTilt){
		xRotation -= 1;	
	}
	
	transform.Translate(movement.x, movement.y, 0, currentTarget.transform);
	
	movement.y = 0.3*vertVar*Time.deltaTime * moveSpeed;
	
	if(yIS < YLowerBound){
		vertVar = 1;
	}else if(yIS > YUpperBound){
		vertVar = -1;
	}
	
	transform.eulerAngles = Vector3(0, 0, zRotation);
	
	if(movement.x == 0.0)
	{
		transform.eulerAngles = Vector3(0, 0, 0);
	}
	
}

//this defines keep alive behavior - bobbing up and down
function keepAlive(){
	findLine();

	if(yIS > YUpperBound){
		transform.Translate(0,-keepAliveSpeed,0);
		goingup = false;
	}
	if(yIS < YLowerBound){
		transform.Translate(0,keepAliveSpeed,0);
		goingup = true;
	}
	if(yIS < YUpperBound && yIS > YLowerBound){
		if(goingup){
			transform.Translate(0,keepAliveSpeed,0);
			if(yIS >= YUpperBound)
				goingup = false;
		}
		if(!goingup){
			transform.Translate(0, -keepAliveSpeed,0);
			if(yIS <= YLowerBound)
				goingup = true;
		}
	}
}

//this tells the robot to move to the z-position specified by the z-bounds
function findLine(){
	var controller : CharacterController = GetComponent(CharacterController);
	
	//find the guard line
	if(transform.position.z < ZLowerBound){
		controller.Move(new Vector3(0,0,.01));
	}
	if(transform.position.z > ZUpperBound){
		controller.Move(new Vector3(0,0,-.01));
	}
}

