class Link {
  final String id;
  String url;
  String title;
  String favicon;
  final int createdAt;

  Link({
    required this.id,
    required this.url,
    this.title = '',
    this.favicon = '',
    required this.createdAt,
  });

  factory Link.fromJson(Map<String, dynamic> json) {
    return Link(
      id: json['id'] as String,
      url: json['url'] as String? ?? '',
      title: json['title'] as String? ?? '',
      favicon: json['favicon'] as String? ?? '',
      createdAt: json['createdAt'] as int? ?? DateTime.now().millisecondsSinceEpoch,
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'url': url,
      'title': title,
      'favicon': favicon,
      'createdAt': createdAt,
    };
  }

  Link copyWith({
    String? id,
    String? url,
    String? title,
    String? favicon,
    int? createdAt,
  }) {
    return Link(
      id: id ?? this.id,
      url: url ?? this.url,
      title: title ?? this.title,
      favicon: favicon ?? this.favicon,
      createdAt: createdAt ?? this.createdAt,
    );
  }
}
