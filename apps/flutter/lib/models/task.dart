enum Quadrant { doFirst, decide, delegate, eliminate }

class Task {
  final String id;
  String title;
  String note;
  List<String> tags;
  String color;
  Quadrant? q;
  bool completed;
  final int createdAt;
  int updatedAt;

  Task({
    required this.id,
    this.title = '',
    this.note = '',
    List<String>? tags,
    this.color = '#ef4444',
    this.q,
    this.completed = false,
    required this.createdAt,
    required this.updatedAt,
  }) : tags = tags ?? [];

  factory Task.fromJson(Map<String, dynamic> json) {
    return Task(
      id: json['id'] as String,
      title: json['title'] as String? ?? '',
      note: json['note'] as String? ?? '',
      tags: (json['tags'] as List<dynamic>?)?.cast<String>() ?? [],
      color: json['color'] as String? ?? '#ef4444',
      q: _parseQuadrant(json['q']),
      completed: json['completed'] as bool? ?? false,
      createdAt: json['createdAt'] as int? ?? DateTime.now().millisecondsSinceEpoch,
      updatedAt: json['updatedAt'] as int? ?? DateTime.now().millisecondsSinceEpoch,
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'title': title,
      'note': note,
      'tags': tags,
      'color': color,
      'q': _quadrantToString(q),
      'completed': completed,
      'createdAt': createdAt,
      'updatedAt': updatedAt,
    };
  }

  Task copyWith({
    String? id,
    String? title,
    String? note,
    List<String>? tags,
    String? color,
    Quadrant? q,
    bool? completed,
    int? createdAt,
    int? updatedAt,
    bool clearQuadrant = false,
  }) {
    return Task(
      id: id ?? this.id,
      title: title ?? this.title,
      note: note ?? this.note,
      tags: tags ?? List.from(this.tags),
      color: color ?? this.color,
      q: clearQuadrant ? null : (q ?? this.q),
      completed: completed ?? this.completed,
      createdAt: createdAt ?? this.createdAt,
      updatedAt: updatedAt ?? this.updatedAt,
    );
  }

  static Quadrant? _parseQuadrant(dynamic value) {
    if (value == null) return null;
    switch (value) {
      case 'do':
        return Quadrant.doFirst;
      case 'decide':
        return Quadrant.decide;
      case 'delegate':
        return Quadrant.delegate;
      case 'delete':
        return Quadrant.eliminate;
      default:
        return null;
    }
  }

  static String? _quadrantToString(Quadrant? q) {
    if (q == null) return null;
    switch (q) {
      case Quadrant.doFirst:
        return 'do';
      case Quadrant.decide:
        return 'decide';
      case Quadrant.delegate:
        return 'delegate';
      case Quadrant.eliminate:
        return 'delete';
    }
  }
}
