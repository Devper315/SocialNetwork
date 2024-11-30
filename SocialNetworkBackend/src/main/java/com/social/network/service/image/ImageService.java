package com.social.network.service.image;

import com.google.cloud.storage.Blob;
import com.google.cloud.storage.Bucket;
import com.google.cloud.storage.Storage;
import com.google.cloud.storage.StorageOptions;
import com.social.network.dto.post.ImageDTO;
import com.social.network.dto.post.PostDTO;
import com.social.network.entity.message.MessageCustom;
import com.social.network.entity.image.Image;
import com.social.network.entity.post.Post;
import com.social.network.entity.user.User;
import com.social.network.repository.image.ImageRepo;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import lombok.experimental.FieldDefaults;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class ImageService {
    ImageRepo imageRepo;

    public List<Image> getByMessage(MessageCustom message) {
        return imageRepo.findByMessage(message);
    }

    public void updatePostImages(PostDTO request, Post post) {
        List<Image> newImages = new ArrayList<>();
        for (ImageDTO i: request.getNewImages()){
            Image newImage = Image.builder()
                    .url(i.getUrl()).filePath(i.getFilePath()).post(post)
                    .build();
            newImages.add(newImage);
        }
        List<Long> deleteImageIds = request.getDeleteImages().stream()
                .map(ImageDTO::getId).toList();
        imageRepo.saveAll(newImages);
        imageRepo.deleteAllById(deleteImageIds);
    }

    public void deleteAllImagesByPostId(Post post) {
        List<Image> images = imageRepo.findByPost(post);
        imageRepo.deleteAll(images);
    }

    public void saveAll(List<Image> images) {
        imageRepo.saveAll(images);
    }
}
