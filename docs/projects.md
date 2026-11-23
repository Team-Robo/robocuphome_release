# Repositories

## Audio

<div class="grid cards project-catalog" markdown="1">

-   <strong id="public-audio-speech_input">Speech recognition</strong><br>
    [`public-audio-speech_input`](https://github.com/Team-Robo/public-audio-speech_input)

    Transcribes microphone audio offline with Whisper and voice activity detection.

-   <strong id="public-audio-speech_output">Speech synthesis</strong><br>
    [`public-audio-speech_output`](https://github.com/Team-Robo/public-audio-speech_output)

    Speaks text on the CPU with Piper voices and priority-based interruption.

</div>

## Person perception

<div class="grid cards project-catalog" markdown="1">

-   <strong id="public-perc-person_pose">Pose estimation</strong><br>
    [`public-perc-person_pose`](https://github.com/Team-Robo/public-perc-person_pose)

    Estimates 2D body keypoints in camera images.

-   <strong id="public-perc-person_body">Body tracking</strong><br>
    [`public-perc-person_body`](https://github.com/Team-Robo/public-perc-person_body)

    Tracks people across frames using whole-body appearance embeddings.

-   <strong id="public-perc-person_face">Face recognition</strong><br>
    [`public-perc-person_face`](https://github.com/Team-Robo/public-perc-person_face)

    Enrols and recognises faces on demand using a local database.

-   <strong id="public-perc-person_identity">Identity fusion</strong><br>
    [`public-perc-person_identity`](https://github.com/Team-Robo/public-perc-person_identity)

    Associates face identities and body tracks.

-   <strong id="public-perc-person_position">3D person tracking</strong><br>
    [`public-perc-person_position`](https://github.com/Team-Robo/public-perc-person_position)

    Estimates a tracked person's 3D position and velocity from RGB-D data.

-   <strong id="public-perc-person_follow_target">Follow target</strong><br>
    [`public-perc-person_follow_target`](https://github.com/Team-Robo/public-perc-person_follow_target)

    Reacquires a selected person for following.

-   <strong id="public-perc-person_description">Appearance description</strong><br>
    [`public-perc-person_description`](https://github.com/Team-Robo/public-perc-person_description)

    Reports appearance attributes that pass a confidence threshold.

</div>

## Scene and object perception

<div class="grid cards project-catalog" markdown="1">

-   <strong id="public-perc-seating_detection">Seat occupancy</strong><br>
    [`public-perc-seating_detection`](https://github.com/Team-Robo/public-perc-seating_detection)

    Locates seats in 3D and classifies their occupancy.

-   <strong id="public-core-mac_registration">Object pose registration</strong><br>
    [`public-core-mac_registration`](https://github.com/Team-Robo/public-core-mac_registration)

    Estimates the 6-DoF pose of a known object by registering depth point clouds.

-   <strong id="public-perc-yolo_segmenter">YOLO segmentation</strong><br>
    [`public-perc-yolo_segmenter`](https://github.com/Team-Robo/public-perc-yolo_segmenter)

    Segments and tracks object instances using a C++ CUDA pipeline.

-   <strong id="public-perc-sam_segmenter">SAM3 segmentation</strong><br>
    [`public-perc-sam_segmenter`](https://github.com/Team-Robo/public-perc-sam_segmenter)

    Segments objects from text prompts using SAM3.

-   <strong id="public-manip-f2g_pose_ros2">F2G-Pose</strong><br>
    [`public-manip-f2g_pose_ros2`](https://github.com/Team-Robo/public-manip-f2g_pose_ros2)

    Estimates object shape and pose and supports fusion across camera views.

-   <strong id="public-perc-cabinet_perception">Cabinet perception</strong><br>
    [`public-perc-cabinet_perception`](https://github.com/Team-Robo/public-perc-cabinet_perception)

    Finds shelf and cubby geometry and estimates free space for placement.

</div>

## Manipulation

<div class="grid cards project-catalog" markdown="1">

-   <strong id="public-core-grasp">Grasping workspace</strong><br>
    [`public-core-grasp`](https://github.com/Team-Robo/public-core-grasp)

    Combines segmentation, point clouds and ranked grasp generation.

-   <strong id="public-manip-r1">Galaxea R1 motion planning</strong><br>
    [`public-manip-R1`](https://github.com/Team-Robo/public-manip-R1)

    Provides MoveIt 2 configuration, calibration and a trajectory execution bridge.

</div>

## Navigation and mapping

<div class="grid cards project-catalog" markdown="1">

-   <strong id="public-nav-semantic_map">Semantic map alignment</strong><br>
    [`public-nav-semantic_map`](https://github.com/Team-Robo/public-nav-semantic_map)

    Aligns OpenUSD scenes with ROS occupancy maps and exports semantic geometry.

-   <strong id="public-nav-far-planner">FAR Planner</strong><br>
    [`public-nav-far-planner`](https://github.com/Team-Robo/public-nav-far-planner)

    Plans global paths with a dynamic visibility graph.

-   <strong id="public-nav-optuna_barn">Planner tuning</strong><br>
    [`public-nav-optuna_barn`](https://github.com/Team-Robo/public-nav-optuna_barn)

    Tunes navigation planner parameters with closed-loop Optuna trials.

</div>

## Developer tools and robot UI

<div class="grid cards project-catalog" markdown="1">

-   <strong id="public-ui-robot_dashboard">Robot dashboard</strong><br>
    [`public-ui-robot_dashboard`](https://github.com/Team-Robo/public-ui-robot_dashboard)

    Provides web controls and ROS 2 graph, topic and behaviour-tree introspection.

-   <strong id="public-core-node_scheduler">Node scheduler</strong><br>
    [`public-core-node_scheduler`](https://github.com/Team-Robo/public-core-node_scheduler)

    Coordinates node lifecycles and GPU memory budgets across machines.

-   <strong id="public-tools-robot_recorder">Robot recorder</strong><br>
    [`public-tools-robot_recorder`](https://github.com/Team-Robo/public-tools-robot_recorder)

    Records synchronised ROS 2 data and exports multi-pane diagnostic video.

-   <strong id="public-ui-robot_face">Robot face</strong><br>
    [`public-ui-robot_face`](https://github.com/Team-Robo/public-ui-robot_face)

    Streams robot expressions to a browser display.

</div>

## BARN Challenge

<div class="grid cards project-catalog" markdown="1">

-   <strong id="mlda-barn-2024">BARN Challenge 2024</strong><br>
    [`mlda-barn-2024`](https://github.com/Team-Robo/mlda-barn-2024)

    Team Robo's official ICRA 2024 BARN Challenge navigation stack and evaluation setup.

-   <strong id="mlda-barn-2025">BARN Challenge 2025</strong><br>
    [`mlda-barn-2025`](https://github.com/Team-Robo/mlda-barn-2025)

    Team Robo's official ICRA 2025 BARN Challenge navigation stack and evaluation setup.

-   <strong id="the_barn_challenge_robo">BARN Challenge 2026</strong><br>
    [`the_barn_challenge_robo`](https://github.com/Team-Robo/the_barn_challenge_robo)

    Team Robo's official ICRA 2026 BARN Challenge navigation stack and evaluation setup.

</div>
