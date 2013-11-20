var target : Transform;

var folX : int;
var folY : int;
var folZ : int;

var rotX : float;
var rotY : float;
var rotZ : float;
var delX : float;
var delY : float;
var delZ : float;

function Start () {
if(folX == 1)
	transform.position.x = target.position.x + delX;
if(folY == 1)
	transform.position.y = target.position.y + delY;
if(folZ == 1)
	transform.position.z = target.position.z + delZ;
	
	transform.eulerAngles = Vector3(rotX, rotY, rotZ);
}

function Update () {
if(folX == 1)
	transform.position.x = target.position.x + delX;
if(folY == 1)
	transform.position.y = target.position.y + delY;
if(folZ == 1)
	transform.position.z = target.position.z + delZ;
	
	transform.eulerAngles = Vector3(rotX, rotY, rotZ);
}