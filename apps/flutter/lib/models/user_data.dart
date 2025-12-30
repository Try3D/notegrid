import 'task.dart';
import 'link.dart';

class UserData {
  List<Task> tasks;
  List<Link> links;
  final int createdAt;
  int updatedAt;

  UserData({
    List<Task>? tasks,
    List<Link>? links,
    required this.createdAt,
    required this.updatedAt,
  })  : tasks = tasks ?? [],
        links = links ?? [];

  factory UserData.empty() {
    final now = DateTime.now().millisecondsSinceEpoch;
    return UserData(
      tasks: [],
      links: [],
      createdAt: now,
      updatedAt: now,
    );
  }

  factory UserData.fromJson(Map<String, dynamic> json) {
    return UserData(
      tasks: (json['tasks'] as List<dynamic>?)
              ?.map((e) => Task.fromJson(e as Map<String, dynamic>))
              .toList() ??
          [],
      links: (json['links'] as List<dynamic>?)
              ?.map((e) => Link.fromJson(e as Map<String, dynamic>))
              .toList() ??
          [],
      createdAt: json['createdAt'] as int? ?? DateTime.now().millisecondsSinceEpoch,
      updatedAt: json['updatedAt'] as int? ?? DateTime.now().millisecondsSinceEpoch,
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'tasks': tasks.map((e) => e.toJson()).toList(),
      'links': links.map((e) => e.toJson()).toList(),
      'createdAt': createdAt,
      'updatedAt': updatedAt,
    };
  }
}
