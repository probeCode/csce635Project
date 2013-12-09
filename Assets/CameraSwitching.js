var cameraWV = null;
var cameraRed = null;
var cameraOrtho = null;
var cameraAR = null;
var cameraOV = null;

var cameraIndex = 1;

var target : Transform;

function Start () {
	cameraWV = GameObject.Find("Main Camera");
	if(cameraWV == null){
		Debug.Log("World view camera not found.");	
	}	
	
	cameraRed = GameObject.Find("Red Camera");
	if(cameraRed == null){
		Debug.Log("Red camera not found.");	
	}
	
	cameraOrtho = GameObject.Find("Ortho Camera");
	if(cameraOrtho == null){
		Debug.Log("Ortho camera not found.");	
	}
	
	cameraAR = GameObject.Find("airRobot Camera");
	if(cameraAR == null){
		Debug.Log("airRobot camera not found.");	
	}
	
	cameraOV = GameObject.Find("Overhead Camera");
	if(cameraOV == null){
		Debug.Log("Overhead camera not found.");	
	}
	
	cameraWV.camera.active = true;
    cameraRed.camera.active = false;
    cameraOrtho.camera.active = false;
    cameraAR.camera.active = false;
    cameraOV.camera.active = false;
}

function Update () {

    if (Input.GetKeyDown(KeyCode.Space)) {
    	cameraIndex = cameraIndex + 1;
		switch(cameraIndex)
		{
		case 1:
		  	cameraWV.camera.active = false;
		    cameraRed.camera.active = true;
		    cameraOrtho.camera.active = false;
		    cameraAR.camera.active = false;
		    cameraOV.camera.active = false;
		  break;
		case 2:
		  	cameraWV.camera.active = false;
		    cameraRed.camera.active = false;
		    cameraOrtho.camera.active = true;
		    cameraAR.camera.active = false;
		    cameraOV.camera.active = false;
		  break;
		case 3:
		  	cameraWV.camera.active = false;
		    cameraRed.camera.active = false;
		    cameraOrtho.camera.active = false;
		    cameraAR.camera.active = true;
		    cameraOV.camera.active = false;
		  break;
		case 4:
		  	cameraWV.camera.active = false;
		    cameraRed.camera.active = false;
		    cameraOrtho.camera.active = false;
		    cameraAR.camera.active = false;
		    cameraOV.camera.active = true;
		  break;
		default:
			cameraWV.camera.active = true;
		    cameraRed.camera.active = false;
		    cameraOrtho.camera.active = false;
		    cameraAR.camera.active = false;
		    cameraOV.camera.active = false;
		    cameraIndex = 0;
		}
    }

}





