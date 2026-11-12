# Team Robo Open Source

[Team Robo](https://teamrobo.vercel.app) is a student-led robotics team from the School of
Electrical & Electronic Engineering at Nanyang Technological University (NTU), Singapore.

We build intelligent robotic systems that combine AI, perception and autonomous navigation.
This site documents the open-source software we are releasing for our **RoboCup@Home** service
robot: a Galaxea R1 mobile manipulator running ROS 2 Humble on NVIDIA Jetson AGX Orin.

The release covers:

- **Audio**: offline speech-to-text and text-to-speech that keep all audio on the robot.
- **Person perception**: pose, whole-body re-identification, face recognition, identity fusion,
  3D position tracking, follow-target re-acquisition and appearance description.
- **Scene and object perception**: free-seat detection, YOLO and SAM3 instance segmentation, and
  known-object pose by point-cloud registration.
- **Grasping** (coming soon): segmentation → object point cloud → 6-DoF grasp synthesis with
  GraspGenX or AnyGrasp.

## Getting Started

The [software stack overview](stack.md) shows how the pieces fit together and lists every Git
repository in the release. Each repository's README has its own setup and launch instructions.

- [HRI Challenge](hri.md) explains how the audio and person-perception repositories serve our
  RoboCup@Home HRI behaviour tree.
- [Grasping](grasping.md) describes the `core-grasp` workspace, which you can clone in one step:

```bash
git clone --recurse-submodules https://github.com/Team-Robo/core-grasp.git
```

All packages target **Ubuntu 22.04 + ROS 2 Humble**. GPU-accelerated nodes also run on a
desktop NVIDIA GPU for development.

## Competitions

- **RoboCup@Home**: developing service robots that assist people in domestic environments.
- **[IEEE ICRA BARN Challenge](https://people.cs.gmu.edu/~xiao/Research/BARN_Challenge/BARN_Challenge26.html)**
  (from 2024 to 2026, the team competed under MLDA@EEE):
    - **ICRA 2026 (Vienna)**: 3rd place in the physical finals, and 1st place in the
      dynamic-obstacle simulation.
    - **ICRA 2025 (Atlanta)**: finalist, and 3rd place in the dynamic-obstacle simulation.
    - **ICRA 2024 (Yokohama)**: 2nd place in the physical finals.
    - **All-time simulation leaderboard**: 15th of 35 entries since 2022, with a BARN score
      of 0.4515 out of a maximum of 0.5.

## Contributing

Contributions are welcome! Feel free to open an issue or pull request in the relevant repository
under the [Team-Robo GitHub organization](https://github.com/Team-Robo).
