# Dataset Versioning System

## Overview

The Dataset Versioning System enables version control, rollback, and comparison of generated dialogue datasets. This is critical for research reproducibility and A/B testing different generation strategies.

## Features

- **Automatic Versioning**: Every pipeline run creates a version snapshot
- **Version Comparison**: Compare metrics, dialogue counts, and configurations between versions
- **Tagging System**: Organize versions with custom tags
- **Export Support**: Export versions in JSON or JSONL format
- **Rollback Capability**: Load any previous version of the dataset

## Usage

### Automatic Versioning

Versions are automatically created after each pipeline run:

```python
# After pipeline completes, a version is created with:
# - All generated dialogues
# - Generation configuration
# - Timestamp and metadata
# - Checksum for integrity verification
```

### API Endpoints

#### List All Versions
```bash
GET /api/versions
GET /api/versions?tags=pipeline,experiment
```

Response:
```json
{
  "versions": [
    {
      "version_id": "20240218_143022",
      "timestamp": "2024-02-18T14:30:22",
      "description": "Pipeline run: 100 dialogues",
      "dialogue_count": 100,
      "domain_distribution": {"hotel": 50, "restaurant": 50},
      "tags": ["pipeline", "auto-generated"]
    }
  ],
  "total": 1
}
```

#### Get Version Details
```bash
GET /api/versions/{version_id}
```

#### Get Version Dialogues
```bash
GET /api/versions/{version_id}/dialogues
GET /api/versions/{version_id}/dialogues?limit=10
```

#### Compare Versions
```bash
POST /api/versions/compare
{
  "version_1": "20240218_143022",
  "version_2": "20240218_150000"
}
```

Response:
```json
{
  "version_1": "20240218_143022",
  "version_2": "20240218_150000",
  "dialogue_count": {
    "v1": 100,
    "v2": 150,
    "difference": 50
  },
  "domain_distribution": {...},
  "avg_turns": {...},
  "checksum_match": false,
  "generation_config_diff": {...}
}
```

#### Tag Version
```bash
POST /api/versions/{version_id}/tag
{
  "tags": ["baseline", "high-quality", "experiment-1"]
}
```

#### Export Version
```bash
POST /api/versions/{version_id}/export
{
  "format": "json",  // or "jsonl"
  "output_path": "/path/to/export.json"  // optional
}
```

## Python API

### Create Version Manually

```python
from goalconvo.dataset_versioning import DatasetVersionManager

version_manager = DatasetVersionManager(data_dir="/path/to/data")

version_id = version_manager.create_version(
    dialogues=dialogue_list,
    description="Experiment with temperature=0.8",
    generation_config={"temperature": 0.8, "max_turns": 20},
    tags=["experiment", "temperature-tuning"]
)
```

### Load Version

```python
# Load version metadata
version = version_manager.get_version(version_id)

# Load dialogues
dialogues = version_manager.load_version_dialogues(version_id)
```

### Compare Versions

```python
comparison = version_manager.compare_versions(
    version_id_1="20240218_143022",
    version_id_2="20240218_150000"
)
```

### List Versions

```python
# All versions
all_versions = version_manager.list_versions()

# Filtered by tags
experiment_versions = version_manager.list_versions(tags=["experiment"])
```

## Use Cases

### 1. A/B Testing Generation Strategies

```python
# Generate with strategy A
version_a = run_pipeline(config_a)

# Generate with strategy B
version_b = run_pipeline(config_b)

# Compare results
comparison = version_manager.compare_versions(version_a, version_b)
```

### 2. Reproducibility

```python
# Save exact configuration with version
version_id = version_manager.create_version(
    dialogues=dialogues,
    generation_config={
        "temperature": 0.75,
        "max_turns": 15,
        "model": "mistral-7b"
    },
    description="Reproducible experiment"
)

# Later, load exact same dataset
dialogues = version_manager.load_version_dialogues(version_id)
```

### 3. Dataset Curation

```python
# Tag high-quality versions
version_manager.tag_version(version_id, ["high-quality", "validated"])

# Export for sharing
version_manager.export_version(
    version_id,
    output_path="dataset_v1.json",
    format="json"
)
```

## Version Storage

Versions are stored in:
```
data/
  versions/
    {version_id}/
      dialogues.json
    version_metadata.json
```

Each version includes:
- Complete dialogue dataset
- Generation configuration
- Metadata (counts, distributions, etc.)
- Checksum for integrity

## Best Practices

1. **Tag Important Versions**: Use tags like "baseline", "production", "experiment-1"
2. **Descriptive Names**: Use clear descriptions when creating versions manually
3. **Regular Exports**: Export important versions for backup
4. **Compare Before Deploying**: Always compare versions before using in production
5. **Clean Up Old Versions**: Periodically remove old experimental versions

## Integration

The versioning system is automatically integrated into:
- Pipeline completion (auto-creates versions)
- Evaluation results (includes version_id)
- Dataset export functionality

## Future Enhancements

- [ ] Version branching (create child versions)
- [ ] Merge versions
- [ ] Diff visualization
- [ ] Version rollback API
- [ ] Automatic cleanup of old versions
- [ ] Version statistics dashboard
