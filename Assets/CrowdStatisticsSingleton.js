#pragma strict

function Start () {

    
}

function Update ()
{
    // Find all crowd members.
    var crowd_members = GameObject.FindGameObjectsWithTag("crowd-member");

    var num_held = 0;
    for(person in crowd_members)
    {
        if(person.transform.position.z > -5.6)
            num_held = num_held + 1;
    }

    guiText.text = num_held.ToString();
}