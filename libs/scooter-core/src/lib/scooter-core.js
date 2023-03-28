/* eslint-disable @typescript-eslint/no-empty-function */
import React, { useState, useEffect } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import classNames from "classnames";
import { ErrorWrapper } from "@factly/scooter-ui";
import { EditorView } from "prosemirror-view";
import { BubbleMenu } from "@factly/scooter-bubble-menu";
import CharacterCount from "./CustomExtensions/CharacterCount";
import { EmbedFetcher } from "@factly/scooter-embed";
import { TagoreFetcher } from "@factly/scooter-tagore";
import { FixedMenu } from "@factly/scooter-fixed-menu";
import { Uploader as ImageUploader } from "@factly/scooter-image";
import useCustomExtensions from "./CustomExtensions/useCustomExtensions";
import {
  generateAddonOptions,
  getEditorStyles,
  getIsPlaceholderActive,
  clipboardTextParser,
  stringifyObject,
  isNilOrEmpty,
  DEFAULT_EDITOR_OPTIONS,
} from "@factly/scooter-shared-utils";

import "./scooter-core.scss";

export const ScooterCore = React.forwardRef(
  (
    {
      forceTitle = false,
      titleError = false,
      hideSlashCommands = false,
      defaults = DEFAULT_EDITOR_OPTIONS,
      addons = [],
      addonCommands,
      className,
      uploadEndpoint,
      iframelyEndpoint,
      uploadConfig = {},
      embedConfig = {},
      tagoreConfig={},
      initialValue = "<p></p>",
      onChange = ({ html, json, text }) => { console.log({ html, json, text }); return { html, json, text } },
      onFocus = () => { },
      onBlur = () => { },
      menuType = "fixed",
      variables,
      mentions,
      showImageInMention = false,
      placeholder = forceTitle ? { title: "Untitled" } : null,
      extensions,
      contentClassName,
      characterLimit,
      editorSecrets,
      rows = 6,
      autoFocus = false,
      onSubmit,
      heightStrategy = "flexible",
      characterCountStrategy = "hidden",
      keyboardShortcuts = [],
      error = null,
      imagesFetcher,
      itemsPerPage,
      onFileAdded,
      onUploadComplete,
      ...otherProps
    },
    ref
  ) => {
    const [isImageUploadVisible, setImageUploadVisible] = useState(false);
    const [isEmbedFetcherVisible, setEmbedFetcherVisible] = useState(false);
    const [isTagoreFetcherVisible, setTagoreFetcherVisible] = useState(false);

    const isFixedMenuActive = menuType === "fixed";
    const isBubbleMenuActive = menuType === "bubble";
    const isSlashCommandsActive = !hideSlashCommands;
    const isPlaceholderActive = getIsPlaceholderActive(placeholder);
    const showSlashCommandPlaceholder =
      !isPlaceholderActive && isSlashCommandsActive;
    const isUnsplashImageUploadActive = addons.includes(
      "image-upload-unsplash"
    );
    const isCharacterCountActive = characterCountStrategy !== "hidden";

    const addonOptions = generateAddonOptions(defaults, addons, {
      includeImageUpload: isUnsplashImageUploadActive,
    });

    const customExtensions = useCustomExtensions({
      contentClassName,
      forceTitle,
      placeholder,
      extensions,
      mentions,
      variables,
      isSlashCommandsActive,
      showImageInMention,
      setImageUploadVisible,
      setEmbedFetcherVisible,
      setTagoreFetcherVisible,
      options: addonOptions,
      addonCommands,
      characterLimit,
      keyboardShortcuts,
      onSubmit,
    });

    // https://github.com/ueberdosis/tiptap/issues/1451#issuecomment-953348865
    EditorView.prototype.updateState = function updateState(state) {
      if (!this.docView) return;
      this.updateStateInner(state, this.state.plugins !== state.plugins);
    };

    const editorClasses = classNames("scooter-editor", {
      "slash-active": showSlashCommandPlaceholder,
      "fixed-menu-active border": isFixedMenuActive,
      "bubble-menu-active": isBubbleMenuActive,
      "force-title": forceTitle,
      "force-title--error": titleError,
      "placeholder-active": isPlaceholderActive,
      [className]: className,
    });

    const editorStyles = getEditorStyles({ heightStrategy, rows });

    const editor = useEditor({
      extensions: customExtensions,
      content: initialValue,
      injectCSS: false,
      autofocus: autoFocus && "end",
      editorProps: {
        attributes: {
          class: editorClasses,
          style: stringifyObject(editorStyles),
        },
        clipboardTextParser,
      },
      parseOptions: {
        preserveWhitespace: true,
      },
      onUpdate: ({ editor }) =>
        onChange({
          html: editor.getHTML(),
          json: editor.getJSON(),
          text: editor.getText(),
        }),
      onFocus,
      onBlur,
    });

    /* Make editor object available to the parent */
    React.useImperativeHandle(ref, () => ({ editor }));

    useEffect(() => {
      const isProduction = [
        process.env.RAILS_ENV,
        process.env.NODE_ENV,
      ].includes("production");
      if (!isProduction && isNilOrEmpty(initialValue)) {
        // eslint-disable-next-line no-console
        console.warn(
          `[scooter-editor]: Empty value of "initialValue" in scooterEditor is expected to be "<p></p>" instead of "${initialValue}".`
        );
      }
    }, [initialValue]);

    return (
      <ErrorWrapper error={error} isFixedMenuActive={isFixedMenuActive}>
        {isFixedMenuActive && (
          <FixedMenu
            editor={editor}
            variables={variables}
            setImageUploadVisible={setImageUploadVisible}
            setEmbedFetcherVisible={setEmbedFetcherVisible}
            options={addonOptions}
            mentions={mentions}
            showImageInMention={showImageInMention}
          />
        )}
        {isBubbleMenuActive && (
          <BubbleMenu editor={editor} options={addonOptions} />
        )}
        <ImageUploader
          isVisible={isImageUploadVisible}
          setIsVisible={setImageUploadVisible}
          editor={editor}
          imageUploadUrl={uploadEndpoint}
          uploadConfig={uploadConfig}
          isUnsplashImageUploadActive={isUnsplashImageUploadActive}
          unsplashApiKey={editorSecrets?.unsplash}
          imagesFetcher={imagesFetcher}
          itemsPerPage={itemsPerPage}
          onFileAdded={onFileAdded}
          onUploadComplete={onUploadComplete}
        />
        <EmbedFetcher
          isVisible={isEmbedFetcherVisible}
          setIsVisible={setEmbedFetcherVisible}
          editor={editor}
          iframelyEndpoint={iframelyEndpoint}
          embedConfig={embedConfig}
        />
        <TagoreFetcher
          isVisible={isTagoreFetcherVisible}
          setIsVisible={setTagoreFetcherVisible}
          editor={editor}
          tagoreConfig={tagoreConfig}
        />
        <EditorContent editor={editor} {...otherProps} />
        {isCharacterCountActive && (
          <CharacterCount
            count={editor?.storage.characterCount.characters()}
            limit={characterLimit}
            strategy={characterCountStrategy}
          />
        )}
      </ErrorWrapper>
    );
  }
);

export default ScooterCore;
