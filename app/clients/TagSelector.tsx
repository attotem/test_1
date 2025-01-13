import React, { useState, useEffect, useRef } from "react";
import { Box, IconButton } from "@mui/material";
import { Close } from "@mui/icons-material";

type TagOption = {
  id: string;
  name: string;
  colour: string;
};

type TagSelectorProps = {
  clientId: string;
  availableTags: TagOption[];
  selectedTags: TagOption[];
  onApplyTags: (tagsToAdd: string[], tagsToRemove: string[]) => void;
  onClose: () => void;
  editable: boolean;
  setEditable: (value: boolean) => void;
};

const TagSelector: React.FC<TagSelectorProps> = ({
  clientId,
  availableTags,
  selectedTags,
  onApplyTags,
  onClose,
  editable,
  setEditable,
}) => {
  const [currentTags, setCurrentTags] = useState<TagOption[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setCurrentTags(selectedTags); 
  }, [selectedTags]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        editable &&
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        handleSave();
        onClose(); 
      }
    };

    if (editable) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [editable, currentTags]);

  const handleTagClick = (tag: TagOption) => {
    const isSelected = currentTags.some((selectedTag) => selectedTag.id === tag.id);
    if (isSelected) {
      setCurrentTags(currentTags.filter((selectedTag) => selectedTag.id !== tag.id));
    } else {
      setCurrentTags([...currentTags, tag]);
    }
  };

  const handleDeleteTag = (tag: TagOption, event: React.MouseEvent) => {
    event.stopPropagation(); 
    setCurrentTags(currentTags.filter((selectedTag) => selectedTag.id !== tag.id));
  };

  const handleSave = () => {
    const newTagIds = currentTags.map((tag) => tag.id);
    const oldTagIds = selectedTags.map((tag) => tag.id);

    const tagsToAdd = newTagIds.filter((id) => !oldTagIds.includes(id));
    const tagsToRemove = oldTagIds.filter((id) => !newTagIds.includes(id));

    onApplyTags(tagsToAdd, tagsToRemove);
    setEditable(false);
  };

  return (
    <Box
      ref={containerRef}
      sx={{
        position: "relative",
        padding: "10px",
        backgroundColor: "#fff",
      }}
    >
      <Box
        sx={{
          display: "flex",
          flexWrap: "wrap",
          gap: "5px",
          cursor: !editable ? "pointer" : "default",
        }}
        onClick={!editable ? () => setEditable(true) : undefined}
      >
        {currentTags.length ? (
          currentTags.map((tag) => (
            <Box
              key={tag.id}
              sx={{
                display: "inline-flex",
                alignItems: "center",
                padding: "5px 10px",
                backgroundColor: tag.colour,
                color: "#fff",
                borderRadius: "5px",
                margin: "2px",
              }}
            >
              {tag.name}
              {editable && (
                <IconButton
                  size="small"
                  onClick={(event) => handleDeleteTag(tag, event)}
                  sx={{
                    color: "#fff",
                    marginLeft: "5px",
                  }}
                >
                  <Close fontSize="small" />
                </IconButton>
              )}
            </Box>
          ))
        ) : (
          <span></span>
        )}
      </Box>

      {editable && (
        <Box
          sx={{
            position: "absolute",
            top: "100%",
            left: "0",
            zIndex: 1000,
            width: "300px",
            padding: "10px",
            border: "1px solid #ddd",
            borderRadius: "8px",
            backgroundColor: "#fff",
            boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
          }}
        >
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: "8px",
            }}
          >
            {availableTags
              .filter((tag) => !currentTags.some((selectedTag) => selectedTag.id === tag.id))
              .map((tag) => (
                <Box
                  key={tag.id}
                  sx={{
                    padding: "5px 10px",
                    borderRadius: "5px",
                    fontWeight: "bold",
                    backgroundColor: "#f0f0f0",
                    border: `1px solid ${tag.colour}`,
                    cursor: "pointer",
                    color: tag.colour,
                  }}
                  onClick={() => handleTagClick(tag)}
                >
                  {tag.name}
                </Box>
              ))}
          </Box>
        </Box>
      )}
    </Box>
  );
};

export default TagSelector;
