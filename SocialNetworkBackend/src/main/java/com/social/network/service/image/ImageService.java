package com.social.network.service.image;

import com.social.network.entity.message.MessageCustom;
import com.social.network.entity.image.Image;
import com.social.network.entity.post.Post;
import com.social.network.entity.user.User;
import com.social.network.repository.image.ImageRepo;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class ImageService {
    ImageRepo imageRepo;

    public List<Image> getByMessage(MessageCustom message){
        return imageRepo.findByMessage(message);
    }

    public List<Image> getByPostId(Post post) {
        return imageRepo.findByPost(post);
    }


    public void createForPost(Post post, List<String> imageUrls) {
        List<Image> images = new ArrayList<>();
        for (String imageUrl: imageUrls){
            Image newImage = Image.builder()
                    .url(imageUrl).post(post)
                    .build();
            images.add(newImage);
        }
        imageRepo.saveAll(images);
    }

    public void updatePostImages(List<String> updateUrls, Post post){
        List <Image> postImages = post.getImageList();
        if (updateUrls != null) {
            if (postImages == null) postImages = new ArrayList<>();
            for (String url : updateUrls) {
                boolean exists = postImages.stream().anyMatch(image -> image.getUrl().equals(url));
                if (!exists) {
                    postImages.add(Image.builder().url(url).post(post).build());
                }
            }
            imageRepo.saveAll(postImages);
            List<Image> imagesToRemove = new ArrayList<>();
            for (Image image : postImages) {
                if (!updateUrls.contains(image.getUrl())) {
                    imagesToRemove.add(image);
                }
            }
            postImages.removeAll(imagesToRemove);
            imageRepo.deleteAll(imagesToRemove);
        }
    }

    public void updateUserAvatar(String updateUrl, User user){
        Image currentAvatar = user.getAvatar();
        if (currentAvatar != null && !currentAvatar.getUrl().equals(updateUrl))
            imageRepo.delete(currentAvatar);
    }

    public String deleteById(Long id){
        imageRepo.deleteById(id);
        return "Xóa ảnh thành công";
    }

    public void deleteAllImagesByPostId(Post post) {
        List<Image> images = imageRepo.findByPost(post);
        imageRepo.deleteAll(images);
    }





}